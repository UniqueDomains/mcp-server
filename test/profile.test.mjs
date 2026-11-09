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
    for (const tool of TOOLS.filter((candidate) => candidate.hosted)) assert.ok(tool.operationId in DETAILS_RULES, tool.operationId);
    assert.equal(detailsFor('get_name_registry', { name: 'Harbor.io' }, null, undefined), 'https://unique.domains/whois/harbor.io');
    // `/tld/<ending>` exists for the public set only: get_tld's band says so; elsewhere the hub (review finding 3).
    assert.equal(detailsFor('get_tld', { tld: '.ai' }, { quality: 'prime' }, undefined), 'https://unique.domains/tld/ai');
    assert.equal(detailsFor('get_tld', { tld: 'aaa' }, { quality: null }, undefined), 'https://unique.domains/tld');
    assert.equal(detailsFor('list_tld_phases', { tld: 'ai' }, [], undefined), 'https://unique.domains/tld');
    assert.equal(detailsFor('list_registrar_prices', { registrar: 'name.com' }, null, undefined), 'https://unique.domains/registrars/name-com');
    assert.equal(detailsFor('get_trend', { slug: 'padel' }, null, undefined), 'https://unique.domains/trending-domains/trends/padel');
    assert.equal(detailsFor('get_edition', { persona: 'investor', date: '2026-11-08' }, null, undefined), 'https://unique.domains/trending-domains/2026-11-08');
    assert.equal(detailsFor('get_domain', { nameOrId: 'dom_1' }, { name: 'harbor.io' }, undefined), 'https://unique.domains/availability/harbor.io');
    assert.equal(detailsFor('get_word_endings', { word: 'harbor' }, null, undefined), null);
    assert.equal(registrarSlug('name.com'), 'name-com');
});

test('the text line names the subject and its fact, or the count and the first three, never an id or a cursor', () => {
    const one = textLine('Stored answer for one domain name', { data: { id: 'dom_123', name: 'harbor.io', status: 'taken' }, meta: { cursor: null }, links: {} });
    assert.equal(one, 'Stored answer for one domain name: harbor.io, status taken.');
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
