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
    assert.equal(textLine('One name', { data: { name: 'harbor.io', status: 'not_checked' }, meta: {}, links: {} }), 'One name: harbor.io, status not checked.');
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
