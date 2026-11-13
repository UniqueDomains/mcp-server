/*----------------------------------
- WHAT EACH PROFILE ANSWERS
----------------------------------*/

/**
 * The two profiles of plan section 2, applied to a tool answer:
 *
 * - `local` keeps every link the API sent (`register`, `product`, `dataset`, ...).
 * - `hosted` serves assistants that never chose us: it strips `links.register` and `links.product` at every depth (no
 *   upsell of any kind, decision 15), sets `links.details` (decision 3), keeps ids and cursors out of the text line
 *   (OpenAI: no session, trace or request ids in results), and trims internal ids and times to the second out of
 *   `data` and `meta` (Gaetan's 2A of 2026-11-10, fix round P-7 and P-8). The API's public contract and the local
 *   profile keep them.
 *
 * The tool selection (which tools a profile and a key's plan register) is here too.
 */

import type { JsonObject, JsonValue } from '@uniquedomains/sdk';

import type { Profile } from './config';
import { detailsFor } from './details';
import { isObject } from './json';
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

const STRIPPED_LINKS = ['register', 'product'];

/** Whether the caller holds no key: the hosted connector always, the npm server without a paid member key. */
export const isKeyless = (profile: Profile, plan: KeyPlan): boolean => profile === 'hosted' || plan === 'none';

/** `limit`'s bound and description for a caller without a key: the document's name the paid page size, plan talk here. */
export const KEYLESS_LIMIT_MAX = 20;
const KEYLESS_LIMIT_DESCRIPTION = `Page size, ${KEYLESS_LIMIT_MAX} at most.`;

/** Wording that names the paid grades, which the hosted connector never repeats (decision 15). */
export const PLAN_TALK = /\bpaid\b|\bsubscriptions?\b|\bkeyed\b|\bfree (?:tier|grade)\b|\bmember key\b|\b(?:founder|investor) (?:plan|key)\b/iu;

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
        if (name === 'limit' && isObject(schema)) {
            // The bound follows the text: the API pages a keyless caller by 20 at most (fix round A4).
            kept[name] = { ...schema, maximum: KEYLESS_LIMIT_MAX, description: KEYLESS_LIMIT_DESCRIPTION };
        } else if (profile === 'hosted' && name === 'fields' && isObject(schema) && typeof schema.description === 'string') {
            kept[name] = { ...schema, description: hostedFieldsDescription(tool.operationId, schema.description) };
        } else if (profile === 'hosted' && isObject(schema) && typeof schema.description === 'string' && KEYLESS_SHAPE_CLAUSE.test(schema.description)) {
            kept[name] = { ...schema, description: schema.description.replace(KEYLESS_SHAPE_CLAUSE, HOSTED_SHAPE_CLAUSE) };
        } else if (profile === 'hosted' && isObject(schema) && typeof schema.description === 'string' && WORD_ID_CLAUSE.test(schema.description)) {
            // "The catalog slug, the word, or `wrd_<id>`.": no hosted answer carries a `wrd_` id any more (fix round A2).
            kept[name] = { ...schema, description: schema.description.replace(WORD_ID_CLAUSE, ' or the word') };
        } else if (profile === 'hosted' && isObject(schema) && typeof schema.description === 'string' && PLAN_TALK.test(schema.description)) {
            // "`properNoun` is ignored on the free tier": plan talk the hosted connector does not carry (decision 15).
            const { description: _dropped, ...rest } = schema;
            kept[name] = rest;
        } else {
            kept[name] = schema;
        }
    }
    return { ...tool.inputSchema, properties: kept };
};

/* ---------- The hosted trim (2A, P-7, P-8) ---------- */

/** A whole value that is an ISO 8601 time. Matched on the whole string only, so a name or a phrase is never cut. */
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/u;

/** Stamps of when the data was computed (`computedAt` of a TLD's market, `rollupAt` of the sales pulse): dropped. */
export const HOSTED_DROPPED_STAMPS: readonly string[] = ['computedAt', 'rollupAt'];

/** Times whose hour is the fact itself: an auction's deadline. Every other time becomes its UTC day. */
export const HOSTED_KEPT_TIMES: readonly string[] = ['endsAt'];

/**
 * An internal id: a `dom_` or `wrd_` id or a UUID under `id` or any `...Id` key, or a row number as a string under
 * `id` (a confirmed price change). Public identifiers stay: an IANA number, an ICANN application id, a Wikidata id,
 * an EPP status code, a venue's or a dataset's slug (`HOSTED_PUBLIC_ID_PATHS`).
 */
const INTERNAL_ID_VALUE = /^(?:dom|wrd)_|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
const ROW_NUMBER = /^\d+$/u;
const isIdKey = (key: string): boolean => key === 'id' || /[a-z]Id$/u.test(key);

/** An `id` left empty (an untracked name's) goes too: the hosted schema no longer declares it. */
export const isInternalId = (key: string, value: JsonValue | undefined): boolean =>
    (key === 'id' && value === null) || (isIdKey(key) && typeof value === 'string' && (INTERNAL_ID_VALUE.test(value) || (key === 'id' && ROW_NUMBER.test(value))));

/** The UTC day of an ISO time; a time with no offset is read as UTC, never as the server's own zone. */
const utcDay = (value: string): string => {
    const time = Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/u.test(value) ? value : `${value}Z`);
    return Number.isNaN(time) ? value.slice(0, 10) : new Date(time).toISOString().slice(0, 10);
};

/**
 * Where each hosted tool's answer holds an internal id, as `outputSchemaFor` drops it from the declared schema (the
 * answer itself is trimmed by value, `isInternalId`). Read from the API document and checked against recorded
 * answers on 2026-11-10; `test/profile.test.mjs` fails when a hosted schema gains an id key that neither this table nor
 * `HOSTED_PUBLIC_ID_PATHS` names.
 */
export const HOSTED_INTERNAL_ID_PATHS: Readonly<Record<string, readonly string[]>> = {
    get_name: ['data.id', 'data.word.id'],
    resolve_word: ['data.match.id', 'data.candidates[].id'],
    list_domains: ['data[].id'],
    get_domain_drops: ['data[].id'],
    list_domain_hacks: ['data[].id'],
    list_tlds: ['data[].phases[].id'],
    get_tld: ['data.phases[].id'],
    list_tld_phases: ['data[].id'],
    list_registrar_changes: ['data[].id'],
    list_price_changes: ['data[].id'],
    list_events: ['data[].id'],
    get_event: ['data.id'],
    get_agenda: ['data.entries[].id', 'data.recentlyAdded[].id', 'data.undated[].id'],
};

/** Id keys of hosted answers that are public identifiers, some of them a hosted tool's own input: kept. */
export const HOSTED_PUBLIC_ID_PATHS: Readonly<Record<string, readonly string[]>> = {
    get_name: ['data.registry.registrar.ianaId'],
    get_name_registry: ['data.registrar.ianaId', 'data.eppStatuses[].id'],
    get_word_notability: ['data.wikidataId'],
    list_tld_applications: ['data[].applicationId'],
    list_tld_application_changes: ['data[].applicationId'],
    get_tld_application_string: ['data.applications[].applicationId', 'data.changes[].applicationId'],
    list_registrars: ['data[].ianaId'],
    list_venues: ['data[].ianaId'],
    get_venue: ['data.ianaId'],
    list_iana_registrars: ['data[].id'],
    get_iana_registrar: ['data.id'],
    get_market_sales: ['data.pulse.windows[].id'],
    list_market_auction_venues: ['data[].id'],
    get_meta_enums: ['data.auctionVenues[].id', 'data.parkingServices[].id'],
    list_meta_datasets: ['data[].id'],
    get_meta_providers: ['data.registrars[].ianaId', 'data.auctionVenues[].id', 'data.parkingServices[].id'],
};

/**
 * Top-level `data` fields a hosted answer leaves out, per operation: `transport` of the registry record names how the
 * record was read (`rdap` or `whois`), the one field whose value says where the data comes from (Gaetan's 2A of
 * 2026-11-13, plan `never-where-data-comes-from`, step M7b). The API keeps it, and so does the local profile.
 */
export const HOSTED_DROPPED_FIELDS: Readonly<Record<string, readonly string[]>> = {
    get_name_registry: ['transport'],
};

/** The hosted answer's `data` without the fields `HOSTED_DROPPED_FIELDS` names for the operation. */
const dropHostedFields = (operationId: string, data: JsonValue): JsonValue => {
    const dropped = HOSTED_DROPPED_FIELDS[operationId];
    if (!dropped || !isObject(data)) return data;
    const out: Record<string, JsonValue> = {};
    for (const [name, child] of Object.entries(data)) if (child !== undefined && !dropped.includes(name)) out[name] = child;
    return out;
};

/** The hosted answer's `data` or `meta`: internal ids and computing stamps out, times to their UTC day. */
export const trimHosted = (value: JsonValue | undefined, key: string | null = null): JsonValue | undefined => {
    if (Array.isArray(value)) return value.map((item: JsonValue) => trimHosted(item, key) ?? null);
    if (typeof value === 'string') return ISO_DATETIME.test(value) && (key === null || !HOSTED_KEPT_TIMES.includes(key)) ? utcDay(value) : value;
    if (!isObject(value)) return value;
    const out: Record<string, JsonValue> = {};
    for (const [name, child] of Object.entries(value)) {
        if (child === undefined || HOSTED_DROPPED_STAMPS.includes(name) || isInternalId(name, child)) continue;
        out[name] = trimHosted(child, name) ?? null;
    }
    return out;
};

/** Removes the named properties from a relaxed schema, following `items` and `anyOf` (paths as `data[].phases[].id`). */
const dropSchemaPaths = (node: JsonValue, path: string, dropped: ReadonlySet<string>): JsonValue => {
    if (!isObject(node)) return node;
    const out: Record<string, JsonValue> = {};
    for (const [key, child] of Object.entries(node)) {
        if (child === undefined) continue;
        if (key === 'properties' && isObject(child)) {
            const kept: Record<string, JsonValue> = {};
            for (const [name, schema] of Object.entries(child)) {
                if (schema === undefined) continue;
                const at = path === '' ? name : `${path}.${name}`;
                if (dropped.has(at) || HOSTED_DROPPED_STAMPS.includes(name)) continue;
                kept[name] = dropSchemaPaths(schema, at, dropped);
            }
            out[key] = kept;
        } else if (key === 'items') {
            out[key] = dropSchemaPaths(child, `${path}[]`, dropped);
        } else if ((key === 'anyOf' || key === 'allOf') && Array.isArray(child)) {
            out[key] = child.map((branch: JsonValue) => dropSchemaPaths(branch, path, dropped));
        } else {
            out[key] = child;
        }
    }
    return out;
};

/**
 * The output schema a profile declares: the hosted one names no `register` or `product` link, no internal id and no
 * computing stamp.
 */
export const outputSchemaFor = (tool: ToolDefinition, profile: Profile): JsonSchema => {
    if (profile === 'local') return tool.outputSchema;
    const properties = tool.outputSchema.properties;
    if (!isObject(properties)) return tool.outputSchema;
    const dropped = new Set([...(HOSTED_INTERNAL_ID_PATHS[tool.operationId] ?? []), ...(HOSTED_DROPPED_FIELDS[tool.operationId] ?? []).map((name) => `data.${name}`)]);
    const data = properties.data === undefined ? undefined : dropSchemaPaths(properties.data, 'data', dropped);
    const meta = properties.meta === undefined ? undefined : dropSchemaPaths(properties.meta, 'meta', dropped);
    const trimmed: Record<string, JsonValue> = { ...properties, ...(data !== undefined ? { data } : {}), ...(meta !== undefined ? { meta } : {}) };
    const links = properties.links;
    if (isObject(links) && isObject(links.properties)) {
        const kept = Object.fromEntries(Object.entries(links.properties).filter(([name]) => !STRIPPED_LINKS.includes(name)));
        trimmed.links = { ...links, properties: kept };
    }
    return { ...tool.outputSchema, properties: trimmed };
};

/** The top-level keys a hosted answer never carries, so the hosted `fields` description does not offer them. */
const hostedDroppedTopKeys = (operationId: string): Set<string> => {
    const keys = new Set([...HOSTED_DROPPED_STAMPS, ...(HOSTED_DROPPED_FIELDS[operationId] ?? [])]);
    for (const path of HOSTED_INTERNAL_ID_PATHS[operationId] ?? []) {
        const match = /^data(?:\[\])?\.([A-Za-z]+)$/u.exec(path);
        if (match?.[1]) keys.add(match[1]);
    }
    return keys;
};

const WORD_ID_CLAUSE = /, the word, or `wrd_<id>`/u;

/**
 * The npm text of `shape` says a proper noun is left out "without a key"; the hosted connector takes no key, and the one
 * mention of a key in its tool list read as a hint to pay (AF-3 of the after-fix check of 2026-11-12).
 */
const KEYLESS_SHAPE_CLAUSE = / A proper noun is left out of an answer without a key\./u;
const HOSTED_SHAPE_CLAUSE = ' Proper nouns are left out here.';

const FIELDS_LIST = /^(Comma-separated top-level keys to keep: )(.+)\.$/u;

/** `fields`'s description on the hosted profile: the list of keys without the ones the trim drops (`id`, `computedAt`). */
const hostedFieldsDescription = (operationId: string, description: string): string => {
    const match = FIELDS_LIST.exec(description);
    if (!match?.[1] || !match[2]) return description;
    const dropped = hostedDroppedTopKeys(operationId);
    const kept = match[2].split(', ').filter((key) => !dropped.has(key));
    return `${match[1]}${kept.join(', ')}.`;
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
    const data = trimHosted(stripLinks(dropHostedFields(operationId, envelope.data))) ?? null;
    const links: Record<string, JsonValue> = {};
    for (const [name, link] of Object.entries(envelope.links)) if (!STRIPPED_LINKS.includes(name) && link !== undefined) links[name] = link;
    links.details = detailsFor(operationId, input, envelope.data, envelope.links.details);
    // `meta` holds no links today; walked so one added there later cannot carry an upsell.
    const meta = trimHosted(stripLinks(envelope.meta));
    return { data, meta: isObject(meta) ? meta : {}, links };
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
        // A reader's words, not the raw value: "status not checked".
        if (typeof value === 'string' && value !== '' && value.length <= 40) return `${key} ${value.replace(/_/gu, ' ')}`;
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
