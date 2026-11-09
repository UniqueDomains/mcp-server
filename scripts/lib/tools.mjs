/*----------------------------------
- TOOL DEFINITIONS FROM THE API DOCUMENT
----------------------------------*/

/**
 * Builds one MCP tool per operation the server exposes, from the SDK's operation table (parameters, tier, plan,
 * metering) and the OpenAPI document it ships (the 200 answer's schema). Pure functions: `generate.mjs` writes the
 * result, the tests read it.
 *
 * The tool set (plan decision 4): every free operation except the five that serve a file or a liveness answer, plus
 * every keyed operation, which the server registers only for a member key of the right plan. The hosted connector
 * leaves out the three free tools behind a one-a-day gate, since it is one caller for every assistant user (P1-D2).
 */

/** Free operations that answer a document, a calendar file or liveness: the JSON tools already carry their data. */
export const TRANSPORT_OPERATIONS = ['get_openapi', 'get_llms_txt', 'get_health', 'get_events_ics', 'get_agenda_ics'];

/** Free tools the hosted connector leaves out: one word or one ending a caller a day, and the connector is one caller. */
export const HOSTED_EXCLUDED_OPERATIONS = ['get_market_sales_word', 'get_word_market', 'list_tld_prices'];

/** The page size a tool sends when the assistant passes none (plan section 2: `limit` defaults to 20). */
export const DEFAULT_LIMIT = 20;

/** Tools that spend a metered unit or write: not read-only. `check_name` alone reads the open registries live. */
const WRITE_OPERATIONS = new Set(['check_name', 'appraise_name', 'request_word']);
const OPEN_WORLD_OPERATIONS = new Set(['check_name']);

/** Words no text of a tool may carry (AGENTS.md, Minimum Data Exposure): no score or ranking, no sales source. */
export const FORBIDDEN_WORDS = [
    /\bscores?\b/i,
    /\branking\b/i,
    /\branked\b/i,
    /\bformula\b/i,
    /namebio/i,
    /dnjournal/i,
    /humbleworth/i,
];

const toolName = (operationId) => `ud_${operationId}`;

/** Titles longer than this are cut at their first comma too. */
const TITLE_SOFT_LIMIT = 60;

/** The summary's first clause, without a leading "The", in sentence case: a short display title. */
export const titleOf = (summary) => {
    let clause = summary.split(/:|;|\. | \(/u)[0].replace(/\.$/u, '').trim();
    if (clause.length > TITLE_SOFT_LIMIT && clause.includes(', ')) clause = clause.split(', ')[0];
    clause = clause.replace(/^The /u, '');
    return clause.charAt(0).toUpperCase() + clause.slice(1);
};

const exampleOf = (parameter) => {
    if (parameter.example !== undefined) return String(parameter.example);
    if (parameter.enum && parameter.enum.length > 0) return String(parameter.enum[0]);
    return null;
};

/** The one clause on what to pass, from the operation's required inputs (Glama scores usage and parameters). */
export const usageOf = (operation) => {
    const required = operation.parameters.filter((parameter) => parameter.required);
    const bodyRequired = operation.body ? operation.body.properties.filter((property) => property.required) : [];
    const parts = required.map((parameter) => {
        const example = exampleOf(parameter);
        return example === null ? `\`${parameter.name}\`` : `\`${parameter.name}\` (such as ${example})`;
    });
    for (const property of bodyRequired) parts.push(`\`${property.name}\` (a list)`);
    const optional = operation.parameters.filter((parameter) => !parameter.required && parameter.name !== 'fields');
    if (parts.length > 0) {
        const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
        return `Pass ${list}${optional.length > 0 ? '; the other inputs are optional' : ''}.`;
    }
    if (optional.some((parameter) => parameter.name === 'limit')) return 'Every input is optional; `limit` sets the page size.';
    if (optional.length > 0) return 'Every input is optional.';
    return 'Takes no input.';
};

/** JSON Schema of one path or query parameter, with the document's description and constraints. */
const parameterSchema = (parameter) => {
    const schema = { type: parameter.type };
    if (parameter.enum) schema.enum = [...parameter.enum];
    if (parameter.minimum !== undefined) schema.minimum = parameter.minimum;
    if (parameter.maximum !== undefined) schema.maximum = parameter.maximum;
    if (parameter.name === 'limit') schema.default = DEFAULT_LIMIT;
    else if (parameter.default !== undefined) schema.default = parameter.default;
    schema.description = parameter.description;
    return schema;
};

const bodyPropertySchema = (property) => {
    const schema = { type: property.type };
    if (property.items) schema.items = { type: property.items.type, ...(property.items.enum ? { enum: [...property.items.enum] } : {}) };
    if (property.enum) schema.enum = [...property.enum];
    if (property.description) schema.description = property.description;
    return schema;
};

/** The tool's input: path and query parameters, then the body's properties, as one flat object. */
export const inputSchemaOf = (operation) => {
    const properties = {};
    const required = [];
    for (const parameter of operation.parameters) {
        properties[parameter.name] = parameterSchema(parameter);
        if (parameter.required) required.push(parameter.name);
    }
    if (operation.body) {
        for (const property of operation.body.properties) {
            if (properties[property.name]) throw new Error(`${operation.id}: body property ${property.name} clashes with a parameter`);
            properties[property.name] = bodyPropertySchema(property);
            if (property.required) required.push(property.name);
        }
    }
    return { type: 'object', properties, ...(required.length > 0 ? { required } : {}), additionalProperties: false };
};

/* ---------- Output schemas ---------- */

/** Keywords an MCP client's JSON Schema validator understands; OpenAPI's own (`example`, `x-*`, `discriminator`) go. */
const KEPT_KEYWORDS = new Set([
    'type',
    'description',
    'properties',
    'items',
    'enum',
    'const',
    'anyOf',
    'allOf',
    'minimum',
    'maximum',
    'minItems',
    'maxItems',
    'minLength',
    'maxLength',
    'additionalProperties',
]);

/**
 * The answer's schema as an MCP `outputSchema`: references inlined, OpenAPI keywords dropped, `oneOf` read as
 * `anyOf`, and no `required` or closed object anywhere. A client validates `structuredContent` against it, and the
 * answer legitimately lacks keys: `fields` keeps only the keys asked, the hosted profile strips two links, a 202 holds
 * the resource so far. The schema describes the shape; it does not gate it.
 */
export const relaxSchema = (node, resolve) => {
    if (Array.isArray(node)) return node.map((item) => relaxSchema(item, resolve));
    if (node === null || typeof node !== 'object') return node;
    if (typeof node.$ref === 'string') return relaxSchema(resolve(node.$ref), resolve);
    const out = {};
    for (const [key, value] of Object.entries(node)) {
        if (key === 'oneOf') {
            out.anyOf = relaxSchema(value, resolve);
            continue;
        }
        if (!KEPT_KEYWORDS.has(key)) continue;
        if (key === 'additionalProperties') {
            if (value !== false) out.additionalProperties = relaxSchema(value, resolve);
            continue;
        }
        if (key === 'properties') {
            out.properties = Object.fromEntries(Object.entries(value).map(([name, schema]) => [name, relaxSchema(schema, resolve)]));
            continue;
        }
        out[key] = relaxSchema(value, resolve);
    }
    return splitTypeArray(out);
};

/** Keywords that only constrain one JSON type, so they follow that type's branch when a type array is split. */
const KEYWORDS_BY_TYPE = {
    object: ['properties', 'additionalProperties'],
    array: ['items', 'minItems', 'maxItems'],
    string: ['minLength', 'maxLength'],
    number: ['minimum', 'maximum'],
    integer: ['minimum', 'maximum'],
};

const enumOfType = (values, type) =>
    values.filter((value) => value !== null && (type === 'integer' || type === 'number' ? typeof value === 'number' : typeof value === type));

/**
 * `type: ["string", "null"]` becomes `anyOf: [{ type: "string" }, { type: "null" }]`. Both are legal JSON Schema; the
 * MCP Inspector's `--strict` check (2.12.0) warns on the array form, since a client that maps tool schemas onto a
 * single-`type` dialect drops or refuses it (726 warnings before this). Each branch keeps the keywords and the enum
 * values of its own type; an `anyOf` the node already had moves under `allOf`, so both still apply.
 */
export const splitTypeArray = (node) => {
    if (!Array.isArray(node.type) || node.type.length < 2) return node;
    const { type: types, description, enum: values, anyOf, allOf, ...rest } = node;
    const branches = types.map((type) => {
        if (type === 'null') return { type: 'null' };
        const branch = { type };
        for (const key of KEYWORDS_BY_TYPE[type] ?? []) if (key in rest) branch[key] = rest[key];
        const own = values ? enumOfType(values, type) : [];
        if (own.length > 0) branch.enum = own;
        return branch;
    });
    const all = [...(allOf ?? []), ...(anyOf ? [{ anyOf }] : [])];
    return { ...(description ? { description } : {}), anyOf: branches, ...(all.length > 0 ? { allOf: all } : {}) };
};

/** The envelope's links as every profile may carry them: `details` added, every key optional. */
const linksSchema = () => ({
    type: 'object',
    description: 'Links of the answer.',
    properties: {
        self: { type: 'string', description: 'This answer on the API.' },
        next: { type: ['string', 'null'], description: 'The next page on the API, when there is one.' },
        register: { type: ['string', 'null'], description: 'Where to register the name, when it can be registered.' },
        product: { type: ['string', 'null'], description: 'The Unique Domains page that opens what a refusal named.' },
        dataset: { type: ['string', 'null'], description: 'The GitHub dataset holding the same rows.' },
        details: { type: ['string', 'null'], description: 'The public Unique Domains page about the subject.' },
    },
});

/** The output schema of one operation, as the local profile answers it (the hosted profile drops two links at run time). */
export const outputSchemaOf = (operationId, document) => {
    const operation = Object.values(document.paths)
        .flatMap((item) => Object.values(item))
        .find((candidate) => candidate && candidate.operationId === operationId);
    if (!operation) throw new Error(`${operationId}: not in the document`);
    const schema = operation.responses?.['200']?.content?.['application/json']?.schema;
    if (!schema) throw new Error(`${operationId}: no JSON 200 answer`);
    const resolve = (ref) => {
        const name = ref.replace('#/components/schemas/', '');
        const target = document.components.schemas[name];
        if (!target) throw new Error(`${operationId}: unresolved ${ref}`);
        return target;
    };
    const relaxed = relaxSchema(schema, resolve);
    const data = relaxed.properties?.data ?? {};
    const links = relaxSchema(linksSchema(), resolve);
    const meta = relaxed.properties?.meta ?? { type: 'object' };
    return {
        type: 'object',
        properties: { data, meta: { ...meta, description: 'The day of the answer, and the page cursor of a list.' }, links },
    };
};

/* ---------- Annotations ---------- */

export const annotationsOf = (operation) => {
    const writes = WRITE_OPERATIONS.has(operation.id);
    return {
        readOnlyHint: !writes,
        destructiveHint: false,
        idempotentHint: !writes,
        openWorldHint: OPEN_WORLD_OPERATIONS.has(operation.id),
    };
};

/** One reason per annotation value, for the directories that ask for them (OpenAI's review asks each value). */
export const justificationOf = (operation) => {
    const unit = operation.metered;
    if (operation.id === 'check_name') {
        return {
            readOnly: `Not read-only: it stores the fresh reading in the catalog and spends one ${unit} unit of the member's month.`,
            openWorld: 'Open world: it reads the name live from its public registry and a registrar.',
            destructive: 'Not destructive: it adds a reading and deletes or overwrites nothing the member made.',
        };
    }
    if (WRITE_OPERATIONS.has(operation.id)) {
        const what = operation.id === 'request_word' ? 'queues the word for the catalog intake' : 'runs and stores the appraisal of a stored name';
        return {
            readOnly: `Not read-only: it ${what} and spends one ${unit} unit of the member's month.`,
            openWorld: 'Closed world: it works on the Unique Domains catalog only.',
            destructive: 'Not destructive: it adds to the catalog and deletes nothing.',
        };
    }
    return {
        readOnly: 'Read-only: it reads stored Unique Domains data and changes nothing.',
        openWorld: 'Closed world: it reads the Unique Domains catalog only, never the open web.',
        destructive: 'Not destructive: it writes and deletes nothing.',
    };
};

/* ---------- The tool set ---------- */

/** Every tool of the server, in the document's order, with the profile it belongs to. */
export const buildTools = (operations, document) => {
    const tools = [];
    for (const operation of Object.values(operations)) {
        if (TRANSPORT_OPERATIONS.includes(operation.id)) continue;
        if (operation.answer !== 'json') throw new Error(`${operation.id}: a file answer outside the transport list`);
        tools.push({
            name: toolName(operation.id),
            operationId: operation.id,
            title: titleOf(operation.summary),
            description: `${operation.summary} ${usageOf(operation)}`,
            tier: operation.tier,
            plan: operation.plan,
            metered: operation.metered,
            hosted: operation.tier === 'free' && !HOSTED_EXCLUDED_OPERATIONS.includes(operation.id),
            inputSchema: inputSchemaOf(operation),
            outputSchema: outputSchemaOf(operation.id, document),
            annotations: annotationsOf(operation),
            justification: justificationOf(operation),
        });
    }
    return tools;
};

/** Every text a tool carries, for the forbidden-word check: title, description and each input's description. */
export const textsOf = (tool) => [
    tool.title,
    tool.description,
    ...Object.values(tool.inputSchema.properties).map((schema) => schema.description ?? ''),
    ...Object.values(tool.justification),
];
