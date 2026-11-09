/*----------------------------------
- WHAT EACH PROFILE ANSWERS
----------------------------------*/

/**
 * The two profiles of plan section 2, applied to a tool answer:
 *
 * - `local` keeps every link the API sent (`register`, `product`, `dataset`, ...).
 * - `hosted` serves assistants that never chose us: it strips `links.register` and `links.product` at every depth (no
 *   upsell of any kind, decision 15), sets `links.details` (decision 3) and keeps ids and cursors out of the text line
 *   (OpenAI: no session, trace or request ids in results).
 *
 * The tool selection (which tools a profile and a key's plan register) is here too.
 */

import type { JsonObject, JsonValue } from '@uniquedomains/sdk';

import type { Profile } from './config';
import { detailsFor } from './details';
import type { JsonSchema, ToolDefinition } from './tool';

/** What a member key opens: nothing beyond the free tools, the Founder set, or every keyed tool. */
export type KeyPlan = 'none' | 'founder' | 'investor';

/** The tools one server registers (plan section 2 and the member keys plan, section 6). */
export const selectTools = (tools: readonly ToolDefinition[], profile: Profile, plan: KeyPlan): ToolDefinition[] => {
    if (profile === 'hosted') return tools.filter((tool) => tool.hosted);
    return tools.filter((tool) => {
        if (tool.tier === 'free') return true;
        if (plan === 'none') return false;
        return tool.plan !== 'investor' || plan === 'investor';
    });
};

/** `Array.isArray` does not narrow a readonly array out of a union, hence the guard. */
export const isObject = (value: JsonValue | undefined): value is JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value);

const STRIPPED_LINKS = ['register', 'product'];

/** Whether the caller holds no key: the hosted connector always, the npm server without a paid member key. */
export const isKeyless = (profile: Profile, plan: KeyPlan): boolean => profile === 'hosted' || plan === 'none';

/** `limit`'s description for a caller without a key: the document's names the paid page size, which is plan talk here. */
const KEYLESS_LIMIT_DESCRIPTION = 'Page size, 20 at most.';

/**
 * The input schema a caller sees: without a key, the inputs only a key may send are left out (review finding 2; the
 * API would refuse them `keyed_only`, and the hosted connector carries no plan talk, decision 15), and `limit` reads
 * its keyless bound.
 */
export const inputSchemaFor = (tool: ToolDefinition, profile: Profile, plan: KeyPlan): JsonSchema => {
    if (!isKeyless(profile, plan)) return tool.inputSchema;
    const properties = tool.inputSchema.properties;
    if (!isObject(properties)) return tool.inputSchema;
    const kept: Record<string, JsonValue> = {};
    for (const [name, schema] of Object.entries(properties)) {
        if (schema === undefined || tool.keyedParameters.includes(name)) continue;
        kept[name] = name === 'limit' && isObject(schema) ? { ...schema, description: KEYLESS_LIMIT_DESCRIPTION } : schema;
    }
    return { ...tool.inputSchema, properties: kept };
};

/** The output schema a profile declares: the hosted one names no `register` or `product` link. */
export const outputSchemaFor = (tool: ToolDefinition, profile: Profile): JsonSchema => {
    if (profile === 'local') return tool.outputSchema;
    const properties = tool.outputSchema.properties;
    if (!isObject(properties)) return tool.outputSchema;
    const links = properties.links;
    if (!isObject(links)) return tool.outputSchema;
    const linkProperties = links.properties;
    if (!isObject(linkProperties)) return tool.outputSchema;
    const kept = Object.fromEntries(Object.entries(linkProperties).filter(([name]) => !STRIPPED_LINKS.includes(name)));
    return { ...tool.outputSchema, properties: { ...properties, links: { ...links, properties: kept } } };
};

/** Removes `register` and `product` from every `links` object at any depth (rows may carry their own links). */
const stripLinks = (value: JsonValue | undefined): JsonValue | undefined => {
    if (Array.isArray(value)) return value.map((item: JsonValue) => stripLinks(item) ?? null);
    if (!isObject(value)) return value;
    const out: Record<string, JsonValue> = {};
    for (const [key, child] of Object.entries(value)) {
        if (child === undefined) continue;
        if (key === 'links' && isObject(child)) {
            const links: Record<string, JsonValue> = {};
            for (const [name, link] of Object.entries(child)) if (!STRIPPED_LINKS.includes(name) && link !== undefined) links[name] = stripLinks(link) ?? null;
            out[key] = links;
        } else {
            out[key] = stripLinks(child) ?? null;
        }
    }
    return out;
};

export type StructuredAnswer = { data: JsonValue; meta: JsonObject; links: JsonObject };

/** The `structuredContent` of an answer for the profile. */
export const shapeAnswer = (
    profile: Profile,
    operationId: string,
    input: Readonly<Record<string, JsonValue | undefined>>,
    envelope: { readonly data: JsonValue; readonly meta: JsonObject; readonly links: JsonObject },
): StructuredAnswer => {
    if (profile === 'local') return { data: envelope.data, meta: envelope.meta, links: envelope.links };
    const data = stripLinks(envelope.data) ?? null;
    const links: Record<string, JsonValue> = {};
    for (const [name, link] of Object.entries(envelope.links)) if (!STRIPPED_LINKS.includes(name) && link !== undefined) links[name] = link;
    links.details = detailsFor(operationId, input, envelope.data, envelope.links.details);
    return { data, meta: envelope.meta, links };
};

/* ---------- The text line ---------- */

/** Keys that name a row or an answer, in order of preference. Ids never: a reader does not need them. */
const LABEL_KEYS = ['name', 'domain', 'word', 'tld', 'ending', 'string', 'phrase', 'title', 'label', 'slug', 'registrar', 'venue'];
/** Keys whose short value is an answer's headline fact. */
const FACT_KEYS = ['status', 'state', 'lifecycle', 'band', 'verdict', 'plan', 'kind'];

const labelOf = (row: JsonValue): string | null => {
    if (typeof row === 'string' || typeof row === 'number') return String(row);
    if (!isObject(row)) return null;
    for (const key of LABEL_KEYS) {
        const value = row[key];
        if (typeof value === 'string' && value !== '') return value;
        if (typeof value === 'number') return String(value);
    }
    return null;
};

const factOf = (row: JsonObject): string | null => {
    for (const key of FACT_KEYS) {
        const value = row[key];
        if (typeof value === 'string' && value !== '' && value.length <= 40) return `${key} ${value}`;
        if (typeof value === 'boolean') return `${key} ${value ? 'yes' : 'no'}`;
    }
    return null;
};

const listLine = (rows: readonly JsonValue[], more: boolean): string => {
    if (rows.length === 0) return 'No rows.';
    const labels = rows.map(labelOf).filter((label): label is string => label !== null);
    const count = `${rows.length} ${rows.length === 1 ? 'row' : 'rows'}${more ? ' on this page, more on the next' : ''}`;
    if (labels.length === 0) return `${count}.`;
    return `${count}: ${labels.slice(0, 3).join(', ')}${labels.length > 3 ? ' and more' : ''}.`;
};

/** The first array of rows inside an object answer (a list wrapped with its totals). */
const rowsInside = (data: JsonObject): readonly JsonValue[] | null => {
    for (const value of Object.values(data)) if (Array.isArray(value) && value.length > 0 && value.every(isObject)) return value;
    return null;
};

/** One line for a reader: the name or word and its headline fact, or the row count and the first three names. */
export const textLine = (title: string, answer: StructuredAnswer): string => {
    const more = typeof answer.meta.cursor === 'string' && answer.meta.cursor !== '';
    if (Array.isArray(answer.data)) return `${title}. ${listLine(answer.data, more)}`;
    if (!isObject(answer.data)) return `${title}.`;
    const label = labelOf(answer.data);
    const fact = factOf(answer.data);
    if (label !== null) return `${title}: ${label}${fact !== null ? `, ${fact}` : ''}.`;
    const rows = rowsInside(answer.data);
    if (rows !== null) return `${title}. ${listLine(rows, more)}`;
    return `${title}.`;
};
