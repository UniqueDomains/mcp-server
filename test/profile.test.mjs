/*----------------------------------
- PROFILES, LINKS, TEXT LINE, INPUT CHECK, CONFIG
----------------------------------*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OPERATIONS } from '@uniquedomains/sdk';

import { detailsFor, outputSchemaFor, readConfig, registrarSlug, resetPhrase, shapeAnswer, splitInput, textLine, TOOLS, DETAILS_RULES, ConfigError } from '../dist/index.js';

const envelope = (data, links = {}) => ({
    data,
    meta: { asOf: null, cursor: null, limit: null },
    links: { self: 'https://api.unique.domains/v1/x', next: null, register: 'https://reg.example/harbor.io', product: 'https://app.unique.domains/x', dataset: null, ...links },
});

test('the hosted profile strips register and product, at every depth, and sets details', () => {
    const answer = shapeAnswer('hosted', 'get_name', { name: 'harbor.io' }, envelope({ name: 'harbor.io', rows: [{ links: { register: 'r', product: 'p', self: 's' } }] }));
    assert.equal(answer.links.register, undefined);
    assert.equal(answer.links.product, undefined);
    assert.equal(answer.links.details, 'https://unique.domains/availability/harbor.io');
    assert.deepEqual(answer.data.rows[0].links, { self: 's' });
    const withMeta = shapeAnswer('hosted', 'get_name', { name: 'harbor.io' }, { ...envelope({ name: 'harbor.io' }), meta: { asOf: null, links: { product: 'p', self: 's' } } });
    assert.deepEqual(withMeta.meta.links, { self: 's' });
    assert.ok(!JSON.stringify(answer).includes('"register"'));
    assert.ok(!JSON.stringify(answer).includes('"product"'));
});

test('the API own details wins over the map', () => {
    const answer = shapeAnswer('hosted', 'list_trends', {}, envelope([], { details: 'https://unique.domains/somewhere' }));
    assert.equal(answer.links.details, 'https://unique.domains/somewhere');
});

test('the local profile keeps every link and adds none', () => {
    const answer = shapeAnswer('local', 'get_name', { name: 'harbor.io' }, envelope({ name: 'harbor.io' }));
    assert.equal(answer.links.register, 'https://reg.example/harbor.io');
    assert.equal(answer.links.product, 'https://app.unique.domains/x');
    assert.equal(answer.links.details, undefined);
});

test('the hosted output schema names no register or product link', () => {
    const tool = TOOLS.find((candidate) => candidate.name === 'ud_get_name');
    const hostedLinks = outputSchemaFor(tool, 'hosted').properties.links.properties;
    assert.equal(hostedLinks.register, undefined);
    assert.equal(hostedLinks.product, undefined);
    assert.ok(hostedLinks.details);
    assert.ok(outputSchemaFor(tool, 'local').properties.links.properties.register);
});

test('every hosted tool has a details rule, and the rules point at the website', () => {
    // Exactly the hosted tools: the rules run on the hosted profile only (review n9).
    assert.deepEqual(Object.keys(DETAILS_RULES).sort(), TOOLS.filter((candidate) => candidate.hosted).map((tool) => tool.operationId).sort());
    assert.equal(detailsFor('get_name_registry', { name: 'Harbor.io' }, null, undefined), 'https://unique.domains/whois/harbor.io');
    // `/tld/<ending>` exists for the public set only: get_tld's band says so; elsewhere the hub (review finding 3).
    assert.equal(detailsFor('get_tld', { tld: '.ai' }, { quality: 'prime' }, undefined), 'https://unique.domains/tld/ai');
    assert.equal(detailsFor('get_tld', { tld: 'aaa' }, { quality: null }, undefined), 'https://unique.domains/tld');
    assert.equal(detailsFor('list_tld_phases', { tld: 'ai' }, [], undefined), 'https://unique.domains/tld');
    assert.equal(detailsFor('list_registrar_prices', { registrar: 'name.com' }, null, undefined), 'https://unique.domains/registrars/name-com');
    assert.equal(detailsFor('get_trend', { slug: 'ambient-lights' }, null, undefined), 'https://unique.domains/trending-domains/trends/ambient-lights');
    assert.equal(detailsFor('get_edition', { persona: 'investor', date: '2026-11-08' }, null, undefined), 'https://unique.domains/trending-domains/2026-11-08');
    // A tool the connector leaves out has no rule: no page (review n9).
    assert.equal(detailsFor('get_domain', { nameOrId: 'dom_1' }, { name: 'harbor.io' }, undefined), null);
    assert.equal(detailsFor('get_word_endings', { word: 'harbor' }, null, undefined), null);
    assert.equal(registrarSlug('name.com'), 'name-com');
});

test('the text line names the subject and its fact, or the count and the first three, never an id or a cursor', () => {
    const one = textLine('Answer for one domain name', { data: { id: 'dom_123', name: 'harbor.io', status: 'taken' }, meta: { cursor: null }, links: {} });
    assert.equal(one, 'Answer for one domain name: harbor.io, status taken.');
    // Gaetan's 8A of 2026-11-14 (decision 34): `not_checked` never reads "status not checked"; other values keep their form.
    assert.equal(textLine('One name', { data: { name: 'harbor.io', status: 'not_checked' }, meta: {}, links: {} }), 'One name: harbor.io, no answer in the catalog; the name may be taken.');
    assert.equal(textLine('One name', { data: { name: 'get.plumbing', status: 'for_sale' }, meta: {}, links: {} }), 'One name: get.plumbing, status for sale.');
    assert.equal(textLine('One event', { data: { title: 'Launch', state: 'not_checked' }, meta: {}, links: {} }), 'One event: Launch, state not checked.');
    const list = textLine('Every root TLD', { data: [{ tld: '.aaa' }, { tld: '.abb' }, { tld: '.abc' }, { tld: '.able' }], meta: { cursor: 'eyJ2Ijox' }, links: {} });
    assert.equal(list, 'Every root TLD. 4 rows on this page, more on the next: .aaa, .abb, .abc and more.');
    assert.ok(!list.includes('eyJ'));
    assert.equal(textLine('Empty', { data: [], meta: {}, links: {} }), 'Empty. No rows.');
});

test('the input check: required, unknown keys, types, enums, ranges, lenient strings', () => {
    const getName = OPERATIONS.get_name;
    assert.throws(() => splitInput(getName, {}), /`name` is required/u);
    assert.throws(() => splitInput(getName, { name: 'harbor.io', nmae: 'x' }), /does not take `nmae`.*takes `name`, `fields`/su);
    assert.deepEqual(splitInput(getName, { name: 'harbor.io' }), { path: { name: 'harbor.io' }, query: {}, body: undefined });

    const listTlds = OPERATIONS.list_tlds;
    assert.deepEqual(splitInput(listTlds, { limit: '5', publicSet: 'true' }).query, { limit: 5, publicSet: true });
    assert.throws(() => splitInput(listTlds, { limit: 0 }), /`limit` must be a whole number from 1 to 100/u);
    assert.throws(() => splitInput(listTlds, { limit: 2.5 }), /whole number/u);
    assert.throws(() => splitInput(listTlds, { ianaStatus: 'nope' }), /one of/u);
    // No limit is filled in: the free grade refuses `limit` on its fixed-cut endpoints.
    assert.deepEqual(splitInput(listTlds, {}).query, {});

    const batch = OPERATIONS.batch_names;
    assert.deepEqual(splitInput(batch, { names: ['a.io', 'b.io'] }).body, { names: ['a.io', 'b.io'] });
    assert.deepEqual(splitInput(batch, { names: 'a.io, b.io' }).body, { names: ['a.io', 'b.io'] });
    assert.throws(() => splitInput(batch, { names: [] }), /non-empty list/u);
    const check = OPERATIONS.check_name;
    assert.throws(() => splitInput(check, { name: 'a.io', blocks: ['nope'] }), /one of/u);
    assert.deepEqual(splitInput(check, { name: 'a.io' }).body, {});

    // Strings are trimmed; a list for a comma-list input is joined; a list elsewhere is still refused.
    assert.deepEqual(splitInput(OPERATIONS.get_tld, { tld: ' ai ' }).path, { tld: 'ai' });
    assert.equal(splitInput(OPERATIONS.list_domains, { status: ['available', 'premium'] }).query.status, 'available,premium');
    assert.equal(splitInput(OPERATIONS.list_domains, { fields: ['id', 'name'] }).query.fields, 'id,name');
    assert.throws(() => splitInput(OPERATIONS.get_tld, { tld: ['ai', 'io'] }), /`tld` must be a string/u);
    assert.throws(() => splitInput(OPERATIONS.get_tld, { tld: '   ' }), /`tld` must be a string/u);
});

test('the config: the hosted profile ignores UD_API_KEY and reads the connector secret only when not blank', () => {
    assert.deepEqual(readConfig({ UD_MCP_PROFILE: 'hosted', UD_API_KEY: 'ud_live_x', UD_CONNECTOR_SECRET: '  ' }), { profile: 'hosted', apiKey: null, apiBase: null, connectorSecret: null });
    assert.equal(readConfig({ UD_MCP_PROFILE: 'hosted', UD_CONNECTOR_SECRET: 's'.repeat(32) }).connectorSecret, 's'.repeat(32));
    assert.deepEqual(readConfig({ UD_API_KEY: ' ud_live_x ', UD_CONNECTOR_SECRET: 'x' }), { profile: 'local', apiKey: 'ud_live_x', apiBase: null, connectorSecret: null });
    assert.throws(() => readConfig({ UD_MCP_PROFILE: 'remote' }), ConfigError);
    assert.throws(() => readConfig({ UD_API_BASE: 'ftp://x' }), ConfigError);
});

test('the reset phrase says seconds under a minute, minutes, then hours', () => {
    const now = new Date('2026-11-09T17:00:00Z');
    assert.equal(resetPhrase(1, now), 'at 17:00 UTC (in about 1 second)');
    assert.equal(resetPhrase(45, now), 'at 17:00 UTC (in about 45 seconds)');
    assert.equal(resetPhrase(900, now), 'at 17:15 UTC (in about 15 minutes)');
    assert.equal(resetPhrase(25200, now), 'at 00:00 UTC (in about 7 hours)');
});

test('a free tool declares no keyed-only field in its output schema', () => {
    for (const tool of TOOLS.filter((candidate) => candidate.tier === 'free')) assert.ok(!JSON.stringify(tool.outputSchema).includes('"score"'), tool.name);
});

test('output schemas describe, never gate: no enum, const, bound or length a new API value would break', () => {
    const gating = new Set(['enum', 'const', 'minimum', 'maximum', 'minItems', 'maxItems', 'minLength', 'maxLength', 'pattern', 'format', 'required']);
    // Walks schema keywords only: under `properties` the keys are field names (`format` is one).
    const walk = (node, name) => {
        if (Array.isArray(node)) return node.forEach((item) => walk(item, name));
        if (node === null || typeof node !== 'object') return;
        for (const [key, value] of Object.entries(node)) {
            if (key === 'properties') {
                for (const child of Object.values(value)) walk(child, name);
                continue;
            }
            assert.ok(!gating.has(key), `${name} ${key}`);
            walk(value, name);
        }
    };
    for (const tool of TOOLS) walk(tool.outputSchema, tool.name);
});

/* ---------- The hosted trim (fix round A2) ---------- */

import { readdirSync, readFileSync } from 'node:fs';
import Ajv from 'ajv';
import { HOSTED_INTERNAL_ID_PATHS, HOSTED_PUBLIC_ID_PATHS, HOSTED_KEPT_TIMES, inputSchemaFor, isInternalId, trimHosted, KEYLESS_LIMIT_MAX } from '../dist/index.js';

const RECORDED = new URL('./fixtures/recorded/', import.meta.url);
const ISO_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/u;
const INTERNAL = /^(?:dom|wrd)_|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

/** The operation a recorded path answers, from the SDK's path templates. */
const operationOf = (path) => {
    const bare = path.split('?')[0];
    const matches = Object.values(OPERATIONS).filter((operation) => operation.method === 'GET' && new RegExp(`^${operation.path.replace(/\{[^}]+\}/gu, '[^/]+')}$`, 'u').test(bare));
    // A literal path wins over a template (`/domains/drops` over `/domains/{nameOrId}`).
    return matches.sort((a, b) => (a.path.includes('{') ? 1 : 0) - (b.path.includes('{') ? 1 : 0))[0];
};

const recordings = readdirSync(RECORDED).map((file) => JSON.parse(readFileSync(new URL(file, RECORDED), 'utf8'))).filter((recording) => recording.status === 200);
const echoedOf = (operation, path) => {
    const names = [...operation.path.matchAll(/\{([^}]+)\}/gu)].map((match) => match[1]);
    const values = operation.path.split('/').map((segment, index) => [segment, path.split('?')[0].split('/')[index]]);
    return Object.fromEntries(values.filter(([segment]) => segment.startsWith('{')).map(([segment, value]) => [segment.slice(1, -1), value]).filter(([name]) => names.includes(name)));
};

/** Every string leaf with its key, at every depth. */
const leaves = (value, key = null, out = []) => {
    if (Array.isArray(value)) value.forEach((item) => leaves(item, key, out));
    else if (value !== null && typeof value === 'object') for (const [name, child] of Object.entries(value)) leaves(child, name, out);
    else out.push([key, value]);
    return out;
};

test('the recorded answers cover the trim shapes: word ids, UUIDs, row numbers, stamps and times', () => {
    const all = recordings.flatMap((recording) => leaves(recording.body.data));
    assert.ok(all.some(([key, value]) => key === 'id' && typeof value === 'string' && value.startsWith('dom_')), 'a dom_ id');
    assert.ok(all.some(([key, value]) => key === 'id' && typeof value === 'string' && value.startsWith('wrd_')), 'a wrd_ id');
    assert.ok(all.some(([key, value]) => key === 'id' && typeof value === 'string' && /^[0-9a-f]{8}-/u.test(value)), 'a UUID');
    assert.ok(all.some(([key]) => key === 'computedAt'), 'a computedAt');
    assert.ok(all.some(([key, value]) => typeof value === 'string' && ISO_TIME.test(value) && key !== 'endsAt'), 'a time');
});

test('hosted answers of every recorded fixture: no internal id, no stamp, no time but a deadline; local answers unchanged', () => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    for (const recording of recordings) {
        const operation = operationOf(recording.path);
        assert.ok(operation, recording.path);
        const tool = TOOLS.find((candidate) => candidate.operationId === operation.id);
        const envelope = { data: recording.body.data, meta: recording.body.meta ?? {}, links: recording.body.links ?? {} };
        const input = echoedOf(operation, recording.path);

        const local = shapeAnswer('local', operation.id, input, envelope);
        assert.deepEqual(local, envelope, `${recording.path} local`);

        const hosted = shapeAnswer('hosted', operation.id, input, envelope);
        for (const [key, value] of [...leaves(hosted.data), ...leaves(hosted.meta)]) {
            assert.ok(!(key === 'id' || /[a-z]Id$/u.test(key ?? '')) || !(typeof value === 'string' && (INTERNAL.test(value) || (key === 'id' && /^\d+$/u.test(value)))), `${recording.path}: ${key} ${value}`);
            assert.ok(key !== 'computedAt' && key !== 'rollupAt', `${recording.path}: ${key}`);
            if (typeof value === 'string' && ISO_TIME.test(value)) assert.ok(HOSTED_KEPT_TIMES.includes(key), `${recording.path}: ${key} ${value}`);
        }
        if (tool.hosted) {
            const validate = ajv.compile(outputSchemaFor(tool, 'hosted'));
            assert.ok(validate(hosted), `${recording.path}: ${JSON.stringify(validate.errors)}`);
        }
    }
});

test('the trim: whole values only, the deadline kept, public ids kept, the UTC day of a time', () => {
    const trimmed = trimHosted({
        id: 'dom_4efccac7-d9df-4c96-a076-3e0cc64220ec',
        name: 'get.plumbing',
        phrase: 'Opens 2026-11-10T10:00:00Z for everyone',
        endsAt: '2026-11-10T18:30:00.000Z',
        expiresAt: '2027-06-03T23:30:53.000+02:00',
        day: '2026-11-10',
        computedAt: '2026-11-10T03:00:00Z',
        word: { id: 'wrd_23922', word: 'plumbing' },
        registrar: { ianaId: 146, name: 'GoDaddy' },
        eppStatuses: [{ id: 'clientDeleteProhibited' }],
        wikidataId: 'Q12345',
        applicationId: 'AA2634T-T39423',
        changes: [{ id: '81233', confirmedAt: '2026-11-09T22:15:00Z' }],
        phases: [{ id: '5bad80ea-d5ae-46f5-a828-0972c05c791e', startsOn: '2026-12-01' }],
    });
    assert.deepEqual(trimmed, {
        name: 'get.plumbing',
        phrase: 'Opens 2026-11-10T10:00:00Z for everyone',
        endsAt: '2026-11-10T18:30:00.000Z',
        expiresAt: '2027-06-03',
        day: '2026-11-10',
        word: { word: 'plumbing' },
        registrar: { ianaId: 146, name: 'GoDaddy' },
        eppStatuses: [{ id: 'clientDeleteProhibited' }],
        wikidataId: 'Q12345',
        applicationId: 'AA2634T-T39423',
        changes: [{ confirmedAt: '2026-11-09' }],
        phases: [{ startsOn: '2026-12-01' }],
    });
    assert.equal(isInternalId('ianaId', '146'), false);
    assert.equal(isInternalId('id', '146'), true);
    // An untracked name's empty `id` goes; an empty public id stays a typed null.
    assert.deepEqual(trimHosted({ id: null, name: 'harbor.io', registrar: { ianaId: null } }), { name: 'harbor.io', registrar: { ianaId: null } });
    // A time with no offset is read as UTC, whatever the server's zone.
    assert.deepEqual(trimHosted({ seenAt: '2026-11-10T23:30:00' }), { seenAt: '2026-11-10' });
});

/** Every `id` or `...Id` property path of a schema, as `data[].phases[].id`. */
const idPaths = (node, path, out = new Set()) => {
    if (Array.isArray(node)) node.forEach((item) => idPaths(item, path, out));
    else if (node !== null && typeof node === 'object') {
        for (const [key, child] of Object.entries(node)) {
            if (key === 'properties') {
                for (const [name, schema] of Object.entries(child)) {
                    const at = `${path}.${name}`;
                    if (name === 'id' || /[a-z]Id$/u.test(name)) out.add(at);
                    idPaths(schema, at, out);
                }
            } else if (key === 'items') idPaths(child, `${path}[]`, out);
            else if (key === 'anyOf' || key === 'allOf') idPaths(child, path, out);
        }
    }
    return out;
};

test('every id key of a hosted tool is named internal or public, and the hosted schema drops the internal ones and the stamps', () => {
    for (const tool of TOOLS.filter((candidate) => candidate.hosted)) {
        const internal = HOSTED_INTERNAL_ID_PATHS[tool.operationId] ?? [];
        const publicIds = HOSTED_PUBLIC_ID_PATHS[tool.operationId] ?? [];
        const declared = [...idPaths(tool.outputSchema.properties.data, 'data')];
        for (const path of declared) assert.ok(internal.includes(path) || publicIds.includes(path), `${tool.name}: ${path} is named nowhere`);
        for (const path of [...internal, ...publicIds]) assert.ok(declared.includes(path), `${tool.name}: ${path} is not in the schema`);
        const hosted = outputSchemaFor(tool, 'hosted');
        const left = [...idPaths(hosted.properties.data, 'data')];
        for (const path of internal) assert.ok(!left.includes(path), `${tool.name}: ${path} still declared`);
        assert.ok(!/"(?:computedAt|rollupAt)"/u.test(JSON.stringify(hosted)), `${tool.name}: a stamp declared`);
    }
    for (const id of Object.keys(HOSTED_INTERNAL_ID_PATHS)) assert.ok(TOOLS.some((tool) => tool.operationId === id && tool.hosted), id);
});

test('the hosted fields list offers no key the trim removes; limit is bounded at 20 without a key', () => {
    const getName = TOOLS.find((tool) => tool.name === 'ud_get_name');
    assert.ok(!/\bid\b/u.test(inputSchemaFor(getName, 'hosted', 'none').properties.fields.description));
    // No hosted input offers a `wrd_` id, which no hosted answer carries.
    for (const tool of TOOLS.filter((candidate) => candidate.hosted)) assert.ok(!JSON.stringify(inputSchemaFor(tool, 'hosted', 'none')).includes('wrd_'), tool.name);
    assert.equal(inputSchemaFor(TOOLS.find((tool) => tool.name === 'ud_get_word_endings'), 'hosted', 'none').properties.word.description, 'The catalog slug or the word.');
    assert.match(inputSchemaFor(TOOLS.find((tool) => tool.name === 'ud_get_word_endings'), 'local', 'none').properties.word.description, /wrd_<id>/u);
    assert.match(inputSchemaFor(getName, 'local', 'none').properties.fields.description, /\bid, name\b/u);
    for (const tool of TOOLS.filter((candidate) => candidate.hosted)) {
        const fields = inputSchemaFor(tool, 'hosted', 'none').properties.fields;
        if (fields?.description) assert.ok(!/\bcomputedAt\b|\brollupAt\b/u.test(fields.description), tool.name);
    }
    const listDomains = TOOLS.find((tool) => tool.name === 'ud_list_domains');
    assert.equal(KEYLESS_LIMIT_MAX, 20);
    assert.equal(inputSchemaFor(listDomains, 'hosted', 'none').properties.limit.maximum, 20);
    assert.equal(inputSchemaFor(listDomains, 'local', 'none').properties.limit.maximum, 20);
    assert.equal(inputSchemaFor(listDomains, 'local', 'founder').properties.limit.maximum, 100);
    const withLimit = TOOLS.filter((tool) => tool.hosted && 'limit' in tool.inputSchema.properties);
    assert.equal(withLimit.length, 13);
    for (const tool of withLimit) {
        const limit = inputSchemaFor(tool, 'hosted', 'none').properties.limit;
        if (limit) assert.equal(limit.maximum, 20, tool.name);
    }
});

/* ---------- The day our data was read, and the auction counts (plan `connector-answer-fixes-2026-11-15`, lane 1) ---------- */

import { apiFieldsFor, runTool, HOSTED_RENAMES } from '../dist/index.js';

// The plan's three fields (section 2.1) and the ones Gaetan's "A" of 2026-11-15 adds (report entry 16).
const READ_DAY = /"(?:asOf|observedOn|observedAt|checkedOn|footprintDay|freshness|verifiedOn)"/u;
const recordingOf = (path) => recordings.find((recording) => recording.path === path);
const envelopeOf = (recording) => ({ data: recording.body.data, meta: recording.body.meta ?? {}, links: recording.body.links ?? {} });
const toolOf = (name) => TOOLS.find((tool) => tool.name === name);

test('D1 = B: no hosted output schema declares a field that says when a record was read, and the hosted meta names no day', () => {
    for (const tool of TOOLS.filter((candidate) => candidate.hosted)) {
        const hosted = outputSchemaFor(tool, 'hosted');
        assert.doesNotMatch(JSON.stringify(hosted), READ_DAY, tool.name);
        assert.equal(hosted.properties.meta.description, undefined, tool.name);
        assert.ok(hosted.properties.meta.properties.cursor && hosted.properties.meta.properties.limit, tool.name);
    }
});

test('D1 = B: the local profile keeps meta.asOf, observedOn and checkedOn, in the answer and the schema', () => {
    const registry = recordingOf('/names/get.plumbing/registry');
    const dated = { ...envelopeOf(registry), meta: { asOf: '2026-11-14', cursor: null, limit: null } };
    const local = shapeAnswer('local', 'get_name_registry', { name: 'get.plumbing' }, dated);
    assert.equal(local.data.observedOn, '2026-09-23');
    assert.equal(local.meta.asOf, '2026-11-14');
    const venue = shapeAnswer('local', 'get_venue', { slug: 'afternic' }, envelopeOf(recordingOf('/venues/afternic')));
    assert.equal(venue.data.listingTerms.checkedOn, '2026-10-10');
    assert.ok('observedOn' in outputSchemaFor(toolOf('ud_get_name_registry'), 'local').properties.data.properties);
    assert.ok('asOf' in outputSchemaFor(toolOf('ud_get_word_endings'), 'local').properties.meta.properties);
    assert.equal(outputSchemaFor(toolOf('ud_get_word_endings'), 'local').properties.meta.description, 'The day of the answer, and the page cursor of a list.');
    assert.match(inputSchemaFor(toolOf('ud_get_name_registry'), 'local', 'none').properties.fields.description, /\bobservedOn\b/u);
});

test('D1 = B: the hosted registry record and venue come without their read days; the rest of the record is kept', () => {
    const registry = recordingOf('/names/get.plumbing/registry');
    const hosted = shapeAnswer('hosted', 'get_name_registry', { name: 'get.plumbing' }, { ...envelopeOf(registry), meta: { asOf: '2026-11-14', cursor: null, limit: null } });
    assert.doesNotMatch(JSON.stringify(hosted), READ_DAY);
    assert.deepEqual(Object.keys(hosted.data), ['read', 'createdAt', 'updatedAt', 'expiresAt', 'registrar', 'eppStatuses', 'nameservers', 'dnssec', 'holder']);
    assert.deepEqual(hosted.meta, { cursor: null, limit: null });
    const venue = shapeAnswer('hosted', 'get_venue', { slug: 'afternic' }, envelopeOf(recordingOf('/venues/afternic')));
    assert.equal(venue.data.listingTerms.checkedOn, undefined);
    assert.deepEqual(venue.data.listingTerms.commission, recordingOf('/venues/afternic').body.data.listingTerms.commission);
    assert.equal(venue.data.footprintDay, undefined);
    assert.deepEqual(venue.data.footprint, recordingOf('/venues/afternic').body.data.footprint);
    // A venue with no verified terms keeps its null.
    assert.equal(shapeAnswer('hosted', 'get_venue', { slug: 'x' }, envelope({ slug: 'x', listingTerms: null })).data.listingTerms, null);
});

test('D1 = B: a hosted caller who sends fields=observedOn gets no observedOn, and the hosted fields text offers neither read time', () => {
    const fields = inputSchemaFor(toolOf('ud_get_name_registry'), 'hosted', 'none').properties.fields.description;
    assert.doesNotMatch(fields, /\bobservedOn\b|\bobservedAt\b|\btransport\b/u);
    assert.equal(fields, 'Comma-separated top-level keys to keep: read, createdAt, updatedAt, expiresAt, registrar, eppStatuses, nameservers, dnssec, holder.');
    // What the API answers to `fields=observedOn`: the one key.
    const asked = shapeAnswer('hosted', 'get_name_registry', { name: 'get.plumbing', fields: 'observedOn' }, { data: { observedOn: '2026-09-23' }, meta: { asOf: '2026-11-14', cursor: null, limit: null }, links: {} });
    assert.deepEqual(asked.data, {});
    assert.doesNotMatch(JSON.stringify(asked), READ_DAY);
    const exact = shapeAnswer('hosted', 'get_name_registry', { name: 'get.plumbing', fields: 'observedAt' }, { data: { observedAt: '2026-09-23T04:10:00.000Z' }, meta: {}, links: {} });
    assert.deepEqual(exact.data, {});
});

test('D1 = B: an answer whose meta.asOf is already null loses the key, not just its value', () => {
    for (const recording of recordings) {
        const operation = operationOf(recording.path);
        if (!TOOLS.find((tool) => tool.operationId === operation.id)?.hosted) continue;
        const hosted = shapeAnswer('hosted', operation.id, echoedOf(operation, recording.path), envelopeOf(recording));
        assert.ok(!('asOf' in hosted.meta), recording.path);
        assert.doesNotMatch(JSON.stringify(hosted), READ_DAY, recording.path);
    }
    const nulled = shapeAnswer('hosted', 'get_name', { name: 'harbor.io' }, envelope({ name: 'harbor.io' }));
    assert.deepEqual(nulled.meta, { cursor: null, limit: null });
});

const AUCTIONS = '/market/auctions';
const TRACKED = { closingWithin24hWithBid: 41, closedYesterdayWithResult: 58, openNow: 44891 };

test('D3 = B: the hosted auctions answer names its counts trackedNames, in place; the local one keeps counts', () => {
    const recording = recordingOf(AUCTIONS);
    const hosted = shapeAnswer('hosted', 'get_market_auctions', {}, envelopeOf(recording));
    assert.deepEqual(Object.keys(hosted.data), ['day', 'closing', 'withBid', 'trackedNames', 'byVenue', 'byEnding', 'byLength', 'next7Days']);
    assert.deepEqual(hosted.data.trackedNames, TRACKED);
    assert.equal(hosted.data.counts, undefined);
    assert.deepEqual(shapeAnswer('local', 'get_market_auctions', {}, envelopeOf(recording)).data.counts, { today: 41, results: 58, all: 44891 });
});

test('D3 = B: the hosted auctions schema describes trackedNames and its three keys in the words of the plan', () => {
    const tool = toolOf('ud_get_market_auctions');
    const data = outputSchemaFor(tool, 'hosted').properties.data;
    assert.equal(data.properties.counts, undefined);
    const tracked = data.properties.trackedNames;
    assert.equal(tracked.description, 'The names we track at auction: one-word catalog names on the endings the catalog covers.');
    assert.deepEqual(Object.keys(tracked.properties), ['closingWithin24hWithBid', 'closedYesterdayWithResult', 'openNow']);
    assert.equal(tracked.properties.closingWithin24hWithBid.description, 'Tracked names that close within 24 hours and have a bid.');
    assert.equal(tracked.properties.closedYesterdayWithResult.description, 'Tracked names that closed yesterday (UTC) with a recorded result.');
    assert.equal(tracked.properties.openNow.description, 'Tracked names whose auction is open.');
    assert.equal(tracked.properties.openNow.type, 'integer');
    assert.ok(outputSchemaFor(tool, 'local').properties.data.properties.counts);
    assert.equal(inputSchemaFor(tool, 'hosted', 'none').properties.fields.description, 'Comma-separated top-level keys to keep: day, closing, withBid, trackedNames, byVenue, byEnding, byLength, next7Days.');
    assert.match(inputSchemaFor(tool, 'local', 'none').properties.fields.description, /\bcounts\b/u);
    assert.deepEqual(Object.keys(HOSTED_RENAMES), ['get_market_auctions']);
});

/** Runs the hosted auctions tool against a stub client that answers the API's `fields` cut of the recorded pulse. */
const runAuctions = async (args, profile = 'hosted') => {
    const recording = recordingOf(AUCTIONS);
    const sent = [];
    const client = {
        requestOperation: async (operationId, options) => {
            sent.push({ operationId, query: options.query ?? {} });
            const keys = typeof options.query?.fields === 'string' ? options.query.fields.split(',') : null;
            const data = keys === null ? recording.body.data : Object.fromEntries(Object.entries(recording.body.data).filter(([key]) => keys.includes(key)));
            return { status: 200, notModified: false, data, meta: recording.body.meta, links: recording.body.links };
        },
    };
    const result = await runTool({ client, profile, plan: 'none', keyless: true }, toolOf('ud_get_market_auctions'), args);
    return { result, sent };
};

test('D3 = B: fields=trackedNames asks the API for counts and answers trackedNames', async () => {
    const { result, sent } = await runAuctions({ fields: 'trackedNames' });
    assert.equal(sent[0].query.fields, 'counts');
    assert.deepEqual(result.structuredContent.data, { trackedNames: TRACKED });
    assert.equal(apiFieldsFor('hosted', 'get_market_auctions', 'day,trackedNames'), 'day,counts');
    // The comma-space form the hosted `fields` text itself shows (review finding l1-f2).
    assert.equal(apiFieldsFor('hosted', 'get_market_auctions', 'day, trackedNames'), 'day,counts');
    assert.equal(apiFieldsFor('local', 'get_market_auctions', 'trackedNames'), 'trackedNames');
    assert.equal(apiFieldsFor('hosted', 'get_name', 'trackedNames'), 'trackedNames');
});

test('D3 = B: fields=counts on the hosted profile answers trackedNames too', async () => {
    const { result, sent } = await runAuctions({ fields: 'counts' });
    assert.equal(sent[0].query.fields, 'counts');
    assert.deepEqual(result.structuredContent.data, { trackedNames: TRACKED });
    assert.ok(!result.content[1].text.includes('"counts"'));
});

test('D3 = B: without fields the hosted answer is whole, with trackedNames and no day it was read', async () => {
    const { result, sent } = await runAuctions({});
    assert.equal(sent[0].query.fields, undefined);
    assert.deepEqual(result.structuredContent.data.trackedNames, TRACKED);
    assert.equal(result.structuredContent.data.day, '2026-11-15');
    assert.ok(!('asOf' in result.structuredContent.meta));
    const local = await runAuctions({}, 'local');
    assert.deepEqual(local.result.structuredContent.data.counts, { today: 41, results: 58, all: 44891 });
});

test('D3 = B: a pulse not ready yet (figures null, lists empty) still names its counts, and fits the hosted schema', () => {
    // The API document: "Figures are null and lists empty until the first figures are ready"; the counts are read apart.
    const recording = recordingOf(AUCTIONS);
    const empty = { ...envelopeOf(recording), data: { day: null, closing: null, withBid: null, counts: { today: 0, results: 0, all: 0 }, byVenue: [], byEnding: [], byLength: [], next7Days: [] } };
    const hosted = shapeAnswer('hosted', 'get_market_auctions', {}, empty);
    assert.deepEqual(hosted.data, { day: null, closing: null, withBid: null, trackedNames: { closingWithin24hWithBid: 0, closedYesterdayWithResult: 0, openNow: 0 }, byVenue: [], byEnding: [], byLength: [], next7Days: [] });
    const validate = new Ajv({ strict: false, allErrors: true }).compile(outputSchemaFor(toolOf('ud_get_market_auctions'), 'hosted'));
    assert.ok(validate(hosted), JSON.stringify(validate.errors));
    assert.equal(textLine('Auctions today', hosted), 'Auctions today.');
});

/* ---------- D1 widened (Gaetan's "A" of 2026-11-15, report entry 16) ---------- */

test('D1 widened: the hosted sales answer comes without freshness, and its fields text does not offer it; the local one keeps it', () => {
    const recording = recordingOf('/market/sales');
    const hosted = shapeAnswer('hosted', 'get_market_sales', {}, envelopeOf(recording));
    assert.equal(hosted.data.freshness, undefined);
    assert.deepEqual(Object.keys(hosted.data), Object.keys(recording.body.data).filter((key) => key !== 'freshness'));
    assert.deepEqual(shapeAnswer('local', 'get_market_sales', {}, envelopeOf(recording)).data.freshness, recording.body.data.freshness);
    assert.doesNotMatch(inputSchemaFor(toolOf('ud_get_market_sales'), 'hosted', 'none').properties.fields.description, /\bfreshness\b/u);
    assert.match(inputSchemaFor(toolOf('ud_get_market_sales'), 'local', 'none').properties.fields.description, /\bfreshness\b/u);
    // `fields=freshness`: what the API answers is the one key, which the hosted answer then leaves out.
    assert.deepEqual(shapeAnswer('hosted', 'get_market_sales', { fields: 'freshness' }, { data: { freshness: recording.body.data.freshness }, meta: {}, links: {} }).data, {});
    assert.doesNotMatch(inputSchemaFor(toolOf('ud_get_venue'), 'hosted', 'none').properties.fields.description, /\bfootprintDay\b/u);
});

test('D1 widened: every auction venue rule and first-year rule comes without verifiedOn, whatever the row holds', () => {
    const rows = [
        {
            id: 'godaddy',
            closeRule: { value: '7 days', verifiedOn: '2026-11-01' },
            paymentRule: null,
            bidderRule: { value: 'Any account', verifiedOn: '2026-10-01' },
            firstYear: { com: { value: { flatFee: 12 }, verifiedOn: '2026-11-02' }, net: null },
            today: null,
        },
        { id: 'parkio', closeRule: null, paymentRule: null, bidderRule: null, firstYear: {}, today: { closing: 3, withBid: 3, medianBidUsd: 99 } },
    ];
    const hosted = shapeAnswer('hosted', 'list_market_auction_venues', {}, { data: rows, meta: { asOf: '2026-11-14', cursor: null, limit: null }, links: {} });
    assert.deepEqual(hosted.data, [
        { id: 'godaddy', closeRule: { value: '7 days' }, paymentRule: null, bidderRule: { value: 'Any account' }, firstYear: { com: { value: { flatFee: 12 } }, net: null }, today: null },
        rows[1],
    ]);
    assert.doesNotMatch(JSON.stringify(hosted), READ_DAY);
    assert.deepEqual(shapeAnswer('local', 'list_market_auction_venues', {}, { data: rows, meta: {}, links: {} }).data, rows);
    assert.deepEqual(shapeAnswer('hosted', 'list_market_auction_venues', {}, { data: [], meta: {}, links: {} }).data, []);
    const schema = outputSchemaFor(toolOf('ud_list_market_auction_venues'), 'hosted').properties.data;
    assert.ok(schema.items.properties.firstYear.additionalProperties, 'the map stays declared');
    assert.ok(schema.items.properties.closeRule.anyOf[0].properties.value, 'the rule keeps its value');
});

test('D1 widened: a trend observation comes without observedAt and keeps its figures', () => {
    const data = { slug: 'ambient-lights', observations: [{ volume: 246000, growth: 87, growthWindow: '1y', observedAt: '2026-11-01T04:12:00.000Z' }] };
    const hosted = shapeAnswer('hosted', 'get_trend', { slug: 'ambient-lights' }, { data, meta: {}, links: {} });
    assert.deepEqual(hosted.data.observations, [{ volume: 246000, growth: 87, growthWindow: '1y' }]);
    assert.equal(shapeAnswer('local', 'get_trend', { slug: 'ambient-lights' }, { data, meta: {}, links: {} }).data.observations[0].observedAt, '2026-11-01T04:12:00.000Z');
    assert.ok(outputSchemaFor(toolOf('ud_get_trend'), 'hosted').properties.data.properties.observations.items.properties.volume);
});

test('D1 widened: the day a change was seen is the change\'s own date and stays on the hosted connector', () => {
    assert.ok(outputSchemaFor(toolOf('ud_list_tld_changes'), 'hosted').properties.data.items.properties.seenOn);
    assert.ok(outputSchemaFor(toolOf('ud_list_tld_application_changes'), 'hosted').properties.data.items.properties.seenAt);
    assert.deepEqual(shapeAnswer('hosted', 'list_tld_changes', {}, { data: [{ tld: '.ai', seenOn: '2026-11-03' }], meta: {}, links: {} }).data, [{ tld: '.ai', seenOn: '2026-11-03' }]);
});

test('D1 widened: the README names every field the hosted answers drop, and the ones that stay', async () => {
    const { HOSTED_DROPPED_FIELDS, HOSTED_DROPPED_META } = await import('../dist/index.js');
    const bullet = readFileSync(new URL('../README.md', import.meta.url), 'utf8').split('\n').find((line) => line.startsWith("- The hosted connector's answers leave out"));
    assert.ok(bullet);
    const leaves = new Set([...HOSTED_DROPPED_META.map((name) => `meta.${name}`), ...Object.values(HOSTED_DROPPED_FIELDS).flat().map((path) => path.split(/\[\]|\{\}|\./u).at(-1))]);
    for (const name of leaves) assert.ok(bullet.includes(`\`${name}\``), name);
    assert.ok(bullet.includes("The day a change was seen (`seenOn`, `seenAt`) and the days of an ending's daily history stay."));
});

/* ---------- D1 widened again (Gaetan's "2A" of 2026-11-16, review of lane 1, section 6) ---------- */

test('2A: a name\'s registry block comes without registryUpdatedAt and keeps the rest; a name with no record keeps its null', () => {
    const recording = recordingOf('/names/get.plumbing');
    const hosted = shapeAnswer('hosted', 'get_name', { name: 'get.plumbing' }, envelopeOf(recording));
    assert.equal(hosted.data.registry.registryUpdatedAt, undefined);
    assert.deepEqual(Object.keys(hosted.data.registry), Object.keys(recording.body.data.registry).filter((key) => key !== 'registryUpdatedAt'));
    assert.equal(hosted.data.registry.registrar.name, 'GoDaddy.com, LLC');
    assert.equal(shapeAnswer('local', 'get_name', { name: 'get.plumbing' }, envelopeOf(recording)).data.registry.registryUpdatedAt, '2026-10-22T13:39:28.000Z');
    assert.equal(shapeAnswer('hosted', 'get_name', { name: 'harbor.io' }, envelope({ name: 'harbor.io', registry: null })).data.registry, null);
    // `ud_get_name`'s `fields` text names `registry`, not its keys: it does not change.
    assert.match(inputSchemaFor(toolOf('ud_get_name'), 'hosted', 'none').properties.fields.description, /\bregistry\b/u);
});

test('2A: the hosted registry record comes without registryUpdatedAt; the local one keeps it', () => {
    const recording = recordingOf('/names/get.plumbing/registry');
    assert.equal(shapeAnswer('hosted', 'get_name_registry', { name: 'get.plumbing' }, envelopeOf(recording)).data.registryUpdatedAt, undefined);
    assert.equal(shapeAnswer('local', 'get_name_registry', { name: 'get.plumbing' }, envelopeOf(recording)).data.registryUpdatedAt, '2026-10-22');
});

test('2A: the catalog totals come without their day; fields=day answers nothing on the hosted connector', () => {
    const data = { day: '2026-11-15', domains: 37000000, words: 133829, tlds: 505 };
    assert.deepEqual(shapeAnswer('hosted', 'get_catalog_stats', {}, { data, meta: {}, links: {} }).data, { domains: 37000000, words: 133829, tlds: 505 });
    assert.equal(shapeAnswer('local', 'get_catalog_stats', {}, { data, meta: {}, links: {} }).data.day, '2026-11-15');
    assert.deepEqual(shapeAnswer('hosted', 'get_catalog_stats', { fields: 'day' }, { data: { day: '2026-11-15' }, meta: {}, links: {} }).data, {});
    assert.equal(inputSchemaFor(toolOf('ud_get_catalog_stats'), 'hosted', 'none').properties.fields.description, 'Comma-separated top-level keys to keep: domains, words, tlds.');
    assert.match(inputSchemaFor(toolOf('ud_get_catalog_stats'), 'local', 'none').properties.fields.description, /\bday\b/u);
});

test('2A: an ending\'s figures come without their day, and each day of the daily history stays', () => {
    const recording = recordingOf('/tlds/ai/stats');
    const hosted = shapeAnswer('hosted', 'get_tld_stats', { tld: 'ai' }, envelopeOf(recording));
    assert.equal(hosted.data.day, undefined);
    assert.equal(hosted.data.tracked, recording.body.data.tracked);
    assert.equal(shapeAnswer('local', 'get_tld_stats', { tld: 'ai' }, envelopeOf(recording)).data.day, '2026-11-10');
    const withHistory = { ...recording.body.data, history: [{ tld: 'ai', day: '2026-11-09', tracked: 1 }, { tld: 'ai', day: '2026-11-10', tracked: 2 }] };
    const both = shapeAnswer('hosted', 'get_tld_stats', { tld: 'ai' }, { data: withHistory, meta: {}, links: {} });
    assert.equal(both.data.day, undefined);
    assert.deepEqual(both.data.history.map((row) => row.day), ['2026-11-09', '2026-11-10']);
    assert.doesNotMatch(inputSchemaFor(toolOf('ud_get_tld_stats'), 'hosted', 'none').properties.fields.description, /\bday\b/u);
});

test('2A: the hosted schemas drop the four paths, keep the history axis, and the local ones keep all of it', () => {
    for (const name of ['ud_get_name', 'ud_get_name_registry']) {
        assert.doesNotMatch(JSON.stringify(outputSchemaFor(toolOf(name), 'hosted')), /"registryUpdatedAt"/u, name);
        assert.match(JSON.stringify(outputSchemaFor(toolOf(name), 'local')), /"registryUpdatedAt"/u, name);
    }
    for (const name of ['ud_get_catalog_stats', 'ud_get_tld_stats']) {
        assert.equal(outputSchemaFor(toolOf(name), 'hosted').properties.data.properties.day, undefined, name);
        assert.ok(outputSchemaFor(toolOf(name), 'local').properties.data.properties.day, name);
    }
    assert.ok(outputSchemaFor(toolOf('ud_get_tld_stats'), 'hosted').properties.data.properties.history.items.properties.day);
});

/* ---------- Lane 3c: the endings split on the hosted connector (plan `connector-answer-fixes-2026-11-15`, D2 = A) ---------- */

const ENDINGS = (lists) => ({
    data: {
        byGroup: { scanned: 5, taken: 2, available: 2, forSale: 1 },
        keyEndings: [{ ending: 'io', status: 'available', price: 32 }],
        openByEnding: { co: 1, io: 1, studio: 1 },
        ...lists,
    },
    meta: { asOf: '2026-11-16', cursor: null, limit: null },
    links: { self: 'https://api.unique.domains/v1/words/harbor/endings', next: null, register: null, product: null, dataset: null },
});

test('lane 3c: the hosted endings answer passes the two lists through, null before the word is rolled up again, and fits its schema', () => {
    const validate = new Ajv({ strict: false, allErrors: true }).compile(outputSchemaFor(toolOf('ud_get_word_endings'), 'hosted'));
    // Side path "the hosted connector before a word is rolled up again": the counts are filled, the two lists still null.
    const before = shapeAnswer('hosted', 'get_word_endings', { word: 'harbor' }, ENDINGS({ availableOn: null, forSaleOn: null }));
    assert.equal(before.data.availableOn, null);
    assert.equal(before.data.forSaleOn, null);
    assert.deepEqual(before.data.openByEnding, { co: 1, io: 1, studio: 1 });
    assert.ok(validate(before), JSON.stringify(validate.errors));
    const after = shapeAnswer('hosted', 'get_word_endings', { word: 'harbor' }, ENDINGS({ availableOn: ['co', 'io'], forSaleOn: ['studio'] }));
    assert.deepEqual([after.data.availableOn, after.data.forSaleOn], [['co', 'io'], ['studio']]);
    assert.ok(validate(after), JSON.stringify(validate.errors));
    // A word with no count yet: every count and list null; a counted word with no open name: two empty lists.
    const none = shapeAnswer('hosted', 'get_word_endings', { word: 'harbor' }, { ...ENDINGS({}), data: { byGroup: null, keyEndings: [], openByEnding: null, availableOn: null, forSaleOn: null } });
    assert.ok(validate(none), JSON.stringify(validate.errors));
    const closed = shapeAnswer('hosted', 'get_word_endings', { word: 'harbor' }, { ...ENDINGS({}), data: { byGroup: { scanned: 3, taken: 3, available: 0, forSale: 0 }, keyEndings: [], openByEnding: {}, availableOn: [], forSaleOn: [] } });
    assert.deepEqual([closed.data.availableOn, closed.data.forSaleOn], [[], []]);
    assert.ok(validate(closed), JSON.stringify(validate.errors));
    for (const answer of [before, after, none, closed]) assert.deepEqual(answer.meta, { cursor: null, limit: null });
    // The two lists' schema texts on the hosted connector: the document's words, with no day in them.
    const { availableOn, forSaleOn, byGroup } = outputSchemaFor(toolOf('ud_get_word_endings'), 'hosted').properties.data.properties;
    assert.equal(availableOn.description, '`availableOn` names the endings where the word is unregistered at the standard price.');
    assert.match(forSaleOn.description, /^`forSaleOn` names the endings where it can be bought another way/u);
    assert.equal(byGroup.description, 'Null for a word with no count yet; zeros are real.');
    assert.match(inputSchemaFor(toolOf('ud_get_word_endings'), 'hosted', 'none').properties.fields.description, /\bavailableOn, forSaleOn\b/u);
});

test('lane 3c: the hosted trackedNames carry the texts the API document now gives counts', () => {
    const document = JSON.parse(readFileSync(new URL('../node_modules/@uniquedomains/sdk/openapi.json', import.meta.url), 'utf8'));
    const operation = Object.values(document.paths).flatMap((item) => Object.values(item)).find((candidate) => candidate?.operationId === 'get_market_auctions');
    const resolve = (node) => (node?.$ref ? resolve(document.components.schemas[node.$ref.replace('#/components/schemas/', '')]) : node);
    const counts = resolve(resolve(resolve(operation.responses['200'].content['application/json'].schema).properties.data).properties.counts);
    const tracked = outputSchemaFor(toolOf('ud_get_market_auctions'), 'hosted').properties.data.properties.trackedNames;
    assert.equal(tracked.description, counts.description);
    for (const [from, to] of [['today', 'closingWithin24hWithBid'], ['results', 'closedYesterdayWithResult'], ['all', 'openNow']]) assert.equal(tracked.properties[to].description, resolve(counts.properties[from]).description, to);
});

test('lane 3c: a venue\'s hosted listingTerms lists no property once checkedOn, its one declared key, is dropped', () => {
    const terms = outputSchemaFor(toolOf('ud_get_venue'), 'hosted').properties.data.properties.listingTerms;
    assert.equal(terms.anyOf[0].properties, undefined);
    assert.equal(terms.anyOf[0].type, 'object');
    assert.ok(outputSchemaFor(toolOf('ud_get_venue'), 'local').properties.data.properties.listingTerms.anyOf[0].properties.checkedOn);
    const venue = shapeAnswer('hosted', 'get_venue', { slug: 'afternic' }, envelopeOf(recordingOf('/venues/afternic')));
    const validate = new Ajv({ strict: false, allErrors: true }).compile(outputSchemaFor(toolOf('ud_get_venue'), 'hosted'));
    assert.ok(validate(venue), JSON.stringify(validate.errors));
    assert.equal(venue.data.listingTerms.checkedOn, undefined);
});
