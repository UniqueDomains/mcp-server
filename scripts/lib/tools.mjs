/*----------------------------------
- TOOL DEFINITIONS FROM THE API DOCUMENT
----------------------------------*/

import { guidanceOf, inputDescriptionOf } from './guidance.mjs';

/**
 * Builds one MCP tool per operation the server exposes, from the SDK's operation table (parameters, tier, plan,
 * metering) and the OpenAPI document it ships (the 200 answer's schema). Pure functions: `generate.mjs` writes the
 * result, the tests read it.
 *
 * The tool set (plan decision 4, then Gaetan's 1A of 2026-11-09): every free operation except the six that serve a
 * file, a liveness answer or a redirect, plus every keyed operation, which the server registers only for a member key
 * of the right plan. The hosted connector leaves out five free tools (`HOSTED_EXCLUDED_OPERATIONS`).
 */

/**
 * Free operations that answer a document, a calendar file or liveness: the JSON tools already carry their data. And
 * `get_meta_tlds`, the v1 path redirected to `/tlds` for one release, which `ud_list_tlds` already serves.
 */
export const TRANSPORT_OPERATIONS = ['get_openapi', 'get_llms_txt', 'get_health', 'get_events_ics', 'get_agenda_ics', 'get_meta_tlds'];

/**
 * Free tools the hosted connector leaves out:
 *
 * - `get_market_sales_word`, `get_word_market`, `list_tld_prices`: one word or one ending a caller a day, and the
 *   connector is one caller for every assistant user (P1-D2).
 * - `get_domain`: without a key it answers the same data as `get_name` (the same `data` keys), and its one difference,
 *   the lookup by a `dom_` id, goes with the hosted trim of internal ids. Two tools with one purpose confuse the model,
 *   and OpenAI's guidelines ask for distinct tools (fix round P-1). It stays on npm, for parity with the API.
 * - `get_meta_freshness`: the state of the data pipeline, not an answer to a user's question; the day of every answer
 *   already sits in its `meta` (fix round P-2). It stays on npm.
 */
export const HOSTED_EXCLUDED_OPERATIONS = ['get_market_sales_word', 'get_word_market', 'list_tld_prices', 'get_domain', 'get_meta_freshness'];

/**
 * Free answers that are the website's fixed cut: the API refuses `limit` (400) and `cursor` (403) without a key, though
 * the document does not mark them keyed. A keyless caller is neither offered them nor lets them reach the API.
 */
export const FIXED_CUT_OPERATIONS = ['list_registrar_prices', 'list_registrar_changes', 'list_price_changes', 'list_price_traps'];
const FIXED_CUT_PARAMETERS = ['limit', 'cursor'];

/** The default page size the input schema shows (plan section 2). It is the API's own: the server fills nothing in. */
export const DEFAULT_LIMIT = 20;

/** Tools that spend a metered unit or write: not read-only. `check_name` alone reads the open registries live. */
const WRITE_OPERATIONS = new Set(['check_name', 'appraise_name', 'request_word']);
const OPEN_WORLD_OPERATIONS = new Set(['check_name']);

/** Words no text of a tool may carry (AGENTS.md, Minimum Data Exposure): no score or ranking, no sales source. */
export const FORBIDDEN_WORDS = [
    /\bscores?\b/i,
    /\bscoring\b/i,
    /\brank\b/i,
    /\brankings?\b/i,
    /\branked\b/i,
    /\bformula\b/i,
    // Built from parts, so `scripts/check-text.mjs` can ban the names in this file too.
    ...[['name', 'bio'], ['dn', 'journal'], ['humble', 'worth']].map((parts) => new RegExp(parts.join(''), 'i')),
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

/**
 * The sample value a description shows for one input: `guidance.mjs`'s own first (review M1 of 2026-11-11: four of
 * the API document's samples answer 404 or another persona's edition on production), then the document's, then the
 * first allowed value.
 */
const exampleOf = (operationId, parameter) => {
    const own = guidanceOf(operationId).examples?.[parameter.name];
    if (own !== undefined) return own;
    if (parameter.example !== undefined) return String(parameter.example);
    if (parameter.enum && parameter.enum.length > 0) return String(parameter.enum[0]);
    return null;
};

/** The one clause on what to pass, from the operation's required inputs (Glama scores usage and parameters). */
export const usageOf = (operation) => {
    const required = operation.parameters.filter((parameter) => parameter.required);
    const bodyRequired = operation.body ? operation.body.properties.filter((property) => property.required) : [];
    const parts = required.map((parameter) => {
        const example = exampleOf(operation.id, parameter);
        return example === null ? `\`${parameter.name}\`` : `\`${parameter.name}\` (such as ${example})`;
    });
    for (const property of bodyRequired) parts.push(`\`${property.name}\` (a list)`);
    const fixedCut = FIXED_CUT_OPERATIONS.includes(operation.id);
    const optional = operation.parameters.filter((parameter) => !parameter.required && parameter.name !== 'fields' && !(fixedCut && FIXED_CUT_PARAMETERS.includes(parameter.name)));
    if (parts.length > 0) {
        const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
        return `Pass ${list}${optional.length > 0 ? '; the other inputs are optional' : ''}.`;
    }
    if (optional.some((parameter) => parameter.name === 'limit')) return 'Every input is optional; `limit` sets the page size.';
    if (optional.length > 0 || fixedCut) return 'Every input is optional.';
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
        const own = inputDescriptionOf(operation.id, parameter.name);
        if (own) properties[parameter.name].description = own;
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

/**
 * The parameters of a free operation that only a key may send (`x-tier: keyed` on the parameter: `sort`, `prefix`,
 * `contains`, ...). The server hides them from a caller without a key (the hosted connector, the keyless npm server):
 * the API refuses them there with `keyed_only`, so showing them would invite a call that always fails.
 */
export const keyedParametersOf = (operationId, document) => {
    const operation = findOperation(operationId, document);
    const fixedCut = FIXED_CUT_OPERATIONS.includes(operationId);
    return (operation.parameters ?? []).filter((parameter) => isKeyedParameter(parameter) || (fixedCut && FIXED_CUT_PARAMETERS.includes(parameter.name))).map((parameter) => parameter.name);
};

/**
 * `x-tier: keyed`, or a description that says the input is paid only where the document has no marker: `include` on
 * `get_word_endings` reads "Comma-separated optional blocks: cheapest (paid)." and its one block is paid.
 */
const isKeyedParameter = (parameter) =>
    parameter['x-tier'] === 'keyed' || /\(paid\)|paid subscriptions only/iu.test(parameter.description ?? parameter.schema?.description ?? '');

const findOperation = (operationId, document) => {
    const operation = Object.values(document.paths)
        .flatMap((item) => Object.values(item))
        .find((candidate) => candidate && candidate.operationId === operationId);
    if (!operation) throw new Error(`${operationId}: not in the document`);
    return operation;
};

/* ---------- Output schemas ---------- */

/** Keywords an MCP client's JSON Schema validator understands; OpenAPI's own (`example`, `x-*`, `discriminator`) go. */
const KEPT_KEYWORDS = new Set(['type', 'description', 'properties', 'items', 'anyOf', 'allOf', 'additionalProperties']);

/**
 * Plan talk in a free tool's output descriptions ("Paid subscriptions only", "keyed", "null on free"): dropped like
 * the score ones, since the hosted connector carries none (decision 15) and the field stays typed.
 */
export const PLAN_WORDS = /\bpaid\b|\bsubscriptions?\b|\bkeyed\b|\bfree (?:tier|grade)\b|\bon free\b|\bnames keyed\b/iu;

/**
 * Plan, price and key talk the plugin bundle's prose never carries (plugin bundle plan, decision 4; review M2): the
 * skill, the bundle's README, every manifest and marketplace description, and the OpenAI sheet's texts. Each entry
 * names what it refuses, so a failing check says which word it met. It allows "launch plans", "registrar pricing",
 * "the events of a month" and the persona values `founder` and `investor` in lower case.
 */
export const BUNDLE_PLAN_TALK = [
    { pattern: /\$\s?\d[\d.,]*|\b\d+(?:[.,]\d+)?\s?(?:USD|EUR|dollars?)\b/u, label: 'a price' },
    // "a month" alone is a calendar month in these texts ("the events of a month"); after an amount it is a price.
    { pattern: /\b\d[\d.,]*\s*(?:USD|EUR|dollars?)?\s*(?:a|\/)\s*(?:month|year)\b|\bper (?:month|year)\b|\bmonthly (?:fee|price|plan)\b/iu, label: 'a price per month' },
    { pattern: /UD_API_KEY|ud_live_/u, label: 'a key or its variable' },
    { pattern: /\b(?:api|member|a|your) keys?\b/iu, label: 'a key' },
    { pattern: /\bmembers?\b|\bmembership\b/iu, label: 'membership' },
    { pattern: /\bupgrad\w*/iu, label: 'an upgrade' },
    { pattern: /\bsubscri\w*/iu, label: 'a subscription' },
    { pattern: /\bpaid\b|\bkeyed\b|\bfree (?:tier|grade)\b/iu, label: 'a paid grade' },
    { pattern: /\b(?:Founder|Investor)\b/u, label: 'a plan name' },
    { pattern: /\b(?:a|our|your|the|paid|free|each|every|any) plans?\b/iu, label: 'a plan' },
];

/** The matches of `BUNDLE_PLAN_TALK` in a text, each as `label ("words met")`; empty when the text is clean. */
export const bundlePlanTalkIn = (text) =>
    BUNDLE_PLAN_TALK.flatMap(({ pattern, label }) => {
        const match = text.match(pattern);
        return match ? [`${label} ("${match[0]}")`] : [];
    });

/**
 * The answer's schema as an MCP `outputSchema`: references inlined, OpenAPI keywords dropped, `oneOf` read as
 * `anyOf`, and no `required` or closed object anywhere. A client validates `structuredContent` against it, and the
 * answer legitimately lacks keys: `fields` keeps only the keys asked, the hosted profile strips two links, a 202 holds
 * the resource so far. The schema describes the shape; it does not gate it: no `enum`, `const`, bound or length is
 * kept either, since a validating client (the Inspector, Cursor, the TypeScript client) would refuse a whole answer the
 * day the API adds a venue, a status or a band, until the server is regenerated.
 */
export const relaxSchema = (node, resolve, options = {}) => {
    const again = (value) => relaxSchema(value, resolve, options);
    if (Array.isArray(node)) return node.map(again);
    if (node === null || typeof node !== 'object') return node;
    if (typeof node.$ref === 'string') return again(resolve(node.$ref));
    const out = {};
    for (const [key, value] of Object.entries(node)) {
        if (key === 'oneOf') {
            out.anyOf = again(value);
            continue;
        }
        if (!KEPT_KEYWORDS.has(key)) continue;
        if (key === 'additionalProperties') {
            if (value !== false) out.additionalProperties = again(value);
            continue;
        }
        if (key === 'properties') {
            const kept = Object.entries(value).filter(([, schema]) => !(options.dropKeyed && isKeyedOnly(schema)));
            out.properties = Object.fromEntries(kept.map(([name, schema]) => [name, again(schema)]));
            continue;
        }
        // A description naming a score or a ranking is dropped, not reworded: the tool texts carry none (AGENTS.md,
        // Minimum Data Exposure), and the field it describes stays typed.
        if (key === 'description' && FORBIDDEN_WORDS.some((word) => word.test(value))) continue;
        if (key === 'description' && options.dropKeyed && PLAN_WORDS.test(value)) continue;
        out[key] = again(value);
    }
    return splitTypeArray(out);
};

/**
 * A field the document marks as keyed only ("Keyed, on this endpoint only.", "Keyed."): a free tool's output schema
 * leaves it out, since the free grade never answers it and the hosted connector's `tools/list` would otherwise name a
 * score. Relaxed schemas stay open, so a member key's answer with the field still validates.
 */
const isKeyedOnly = (schema) => schema !== null && typeof schema === 'object' && typeof schema.description === 'string' && /^Keyed\b/u.test(schema.description);

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

/**
 * Answer fields the API makes nullable before the SDK's document says so, per operation: the server declares them
 * nullable now, so a validating client accepts the new answer whichever of the platform, the SDK and this server ships
 * first. `get_word_endings`: a word with no endings count yet answers `byGroup` and `openByEnding` null, not zeros
 * (2026-11-11, decision B). A field the document already makes nullable is left as it is, so the entry is a no-op once
 * the SDK ships it and can then go.
 */
export const NULLABLE_AHEAD_OF_SDK = {
    get_word_endings: ['byGroup', 'openByEnding'],
};

const acceptsNull = (schema) => schema?.type === 'null' || (Array.isArray(schema?.anyOf) && schema.anyOf.some(acceptsNull));

const EDITION_COUNTS = {
    trendCount: 'Trends in the whole edition. `trends` lists at most 20, the ones the public page shows, so this count can be larger.',
    nameCount: 'Names in the whole edition; `openCount` of them are open here.',
};
const ROW_STATUS = 'The stored status of the row. One name\'s own answer groups it for a buyer: `resell` reads `for_sale` there, `premium` reads `free_premium`.';

/**
 * Field descriptions the platform's API document gains with the release that carries this server's 0.1.5 (the
 * directory quality audit of 2026-11-11, Gaetan's 3A), copied word for word so the declared output schema explains
 * the answer now: an edition's counts beside its public cut, and the two status vocabularies (`for_sale` on one name,
 * `resell` on a list row). Applied to `data`'s properties, or to its items' for a list. Like `NULLABLE_AHEAD_OF_SDK`,
 * a no-op once the SDK's document carries the same text, and removed with it.
 */
export const DESCRIBED_AHEAD_OF_SDK = {
    get_latest_edition: EDITION_COUNTS,
    get_edition: EDITION_COUNTS,
    get_name: { status: 'Where the name stands for a buyer. A list row\'s stored status reads here as: `resell` is `for_sale` (`at_auction` at a drop-catch venue), `premium` is `free_premium`.' },
    list_domains: { status: ROW_STATUS },
    list_domain_hacks: { status: ROW_STATUS },
};

/** `data`'s fields (or its items' fields) named in `DESCRIBED_AHEAD_OF_SDK`, each given its description. */
export const describeAheadOfSdk = (operationId, data) => {
    const notes = DESCRIBED_AHEAD_OF_SDK[operationId];
    if (!notes) return data;
    const isList = !data?.properties && data?.items?.properties;
    const target = isList ? data.items : data;
    if (!target?.properties) throw new Error(`${operationId}: no fields to describe`);
    const properties = { ...target.properties };
    for (const [name, description] of Object.entries(notes)) {
        if (!properties[name]) throw new Error(`${operationId}: no \`${name}\` to describe`);
        properties[name] = { ...properties[name], description };
    }
    return isList ? { ...data, items: { ...data.items, properties } } : { ...data, properties };
};

/** `data`'s fields named in `NULLABLE_AHEAD_OF_SDK`, each widened to also accept null. */
export const widenAheadOfSdk = (operationId, data) => {
    const names = NULLABLE_AHEAD_OF_SDK[operationId] ?? [];
    if (names.length === 0 || !data?.properties) return data;
    const properties = { ...data.properties };
    for (const name of names) {
        const field = properties[name];
        if (!field) throw new Error(`${operationId}: no \`${name}\` to widen`);
        if (acceptsNull(field)) continue;
        const { description, ...shape } = field;
        properties[name] = { ...(description ? { description } : {}), anyOf: [shape, { type: 'null' }] };
    }
    return { ...data, properties };
};

/** The output schema of one operation, as the local profile answers it (the hosted profile drops two links at run time). */
export const outputSchemaOf = (operationId, document) => {
    const operation = findOperation(operationId, document);
    const schema = operation.responses?.['200']?.content?.['application/json']?.schema;
    if (!schema) throw new Error(`${operationId}: no JSON 200 answer`);
    const resolve = (ref) => {
        const name = ref.replace('#/components/schemas/', '');
        const target = document.components.schemas[name];
        if (!target) throw new Error(`${operationId}: unresolved ${ref}`);
        return target;
    };
    const relaxed = relaxSchema(schema, resolve, { dropKeyed: operation['x-tier'] === 'free' });
    const data = describeAheadOfSdk(operationId, widenAheadOfSdk(operationId, relaxed.properties?.data ?? {}));
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

/**
 * The summary a tool's description opens with. A free tool's summary loses a clause that talks grades ("Names
 * dropping on one day: counts free, names keyed."): the hosted connector lists free tools only and names no plan
 * (decision 15).
 */
export const summaryOf = (operation) => {
    const own = guidanceOf(operation.id).summary;
    if (own !== undefined) return own;
    const summary = operation.summary.trim();
    if (operation.tier !== 'free') return summary;
    const [head, ...tail] = summary.split(': ');
    return tail.length > 0 && PLAN_WORDS.test(tail.join(': ')) ? `${head.replace(/\.$/u, '')}.` : summary;
};

/** A description's bound in characters: room for the summary, the use sentence and what to pass, under a screen line or three. */
export const DESCRIPTION_MAX_LENGTH = 350;

/** What the tool reads, when to use it, then what to pass (fix round A1). */
export const descriptionOf = (operation) => `${summaryOf(operation)} ${guidanceOf(operation.id).use} ${usageOf(operation)}`;

/** Every tool of the server, in the document's order, with the profile it belongs to. */
export const buildTools = (operations, document) => {
    const tools = [];
    for (const operation of Object.values(operations)) {
        if (TRANSPORT_OPERATIONS.includes(operation.id)) continue;
        if (operation.answer !== 'json') throw new Error(`${operation.id}: a file answer outside the transport list`);
        tools.push({
            name: toolName(operation.id),
            operationId: operation.id,
            // From the summary the description opens with, so a replaced summary (`guidance.mjs`) fixes the title too: the
            // title is `tools/list`'s, the README's and the first words of every answer's text line.
            title: titleOf(summaryOf(operation)),
            description: descriptionOf(operation),
            tier: operation.tier,
            plan: operation.plan,
            metered: operation.metered,
            hosted: operation.tier === 'free' && !HOSTED_EXCLUDED_OPERATIONS.includes(operation.id),
            inputSchema: inputSchemaOf(operation),
            keyedParameters: keyedParametersOf(operation.id, document),
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
    ...descriptionsIn(tool.outputSchema),
];

/** Every `description` inside a schema. */
const descriptionsIn = (node) => {
    if (Array.isArray(node)) return node.flatMap(descriptionsIn);
    if (node === null || typeof node !== 'object') return [];
    return [...(typeof node.description === 'string' ? [node.description] : []), ...Object.values(node).flatMap(descriptionsIn)];
};
