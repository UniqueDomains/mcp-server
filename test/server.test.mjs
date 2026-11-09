/*----------------------------------
- THE SERVER: KEY BOOT, CALLS, REFUSALS
----------------------------------*/

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';

import { createMcpServer, prepareServer, readConfig, ConfigError } from '../dist/index.js';
import { FOUNDER_KEY, INVESTOR_KEY, REFUSED_KEY, UNPAID_KEY, problem, startApiFixture } from './support/api-fixture.mjs';

let fixture;
const NOW = new Date('2026-11-09T17:00:00Z');

before(async () => {
    fixture = await startApiFixture({
        'GET /names/plan.io/registry/history': problem(403, 'plan_required', 'This endpoint comes with the Investor plan.', {
            body: { product: 'https://app.unique.domains/home?upgrade=investor' },
        }),
        'GET /names/quota.io/prices': problem(429, 'quota_spent', "This key's month is spent.", {
            headers: { 'X-Quota-Limit': '10000', 'X-Quota-Remaining': '0', 'X-Quota-Reset': '2026-12-01T00:00:00Z', 'Retry-After': '1922400' },
        }),
        'GET /tlds/busy': [problem(429, 'rate_limited', 'Too many calls this second.', { headers: { 'Retry-After': '2' } }), { status: 200, body: { data: { tld: 'busy' }, meta: {}, links: {} } }],
        'GET /tlds/spent': problem(429, 'budget_spent', "The connector's day is spent.", { headers: { 'Retry-After': '25200' } }),
        'GET /tlds/down': problem(503, 'internal', 'The API is restarting.'),
        'POST /names/slow.io/check': { status: 202, headers: { 'Content-Type': 'application/json', 'Retry-After': '30', Location: '/v1/names/slow.io' }, body: { data: { name: 'slow.io', status: 'checking' }, meta: {}, links: {} } },
    });
});
after(() => fixture.close());

const connect = async (env, overrides = {}) => {
    const prepared = await prepareServer(readConfig({ UD_API_BASE: fixture.base, ...env }), { log: () => {} });
    const server = createMcpServer(prepared, { now: () => NOW, sleep: async () => {}, ...overrides });
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' });
    await Promise.all([client.connect(clientSide), server.connect(serverSide)]);
    return { client, prepared };
};

const names = async (client) => (await client.listTools()).tools.map((tool) => tool.name);

test('without a key: the 57 free tools, and no get_key call', async () => {
    const before = fixture.requests.length;
    const { client } = await connect({});
    assert.equal((await names(client)).length, 57);
    assert.equal(fixture.requests.slice(before).filter((request) => request.path === '/meta/key').length, 0);
    await client.close();
});

test('a Founder key adds the keyed tools without the Investor set', async () => {
    const { client } = await connect({ UD_API_KEY: FOUNDER_KEY });
    const list = await names(client);
    assert.ok(list.includes('ud_get_name_prices') && list.includes('ud_get_key') && list.includes('ud_check_name'));
    assert.ok(!list.includes('ud_batch_names') && !list.includes('ud_appraise_name'));
    assert.ok(list.includes('ud_get_word_notability') && list.includes('ud_get_word_market'));
    assert.equal(list.length, 67);
    await client.close();
});

test('an Investor key shows every tool', async () => {
    const { client } = await connect({ UD_API_KEY: INVESTOR_KEY });
    assert.equal((await names(client)).length, 82);
    await client.close();
});

test('a key with no paid plan keeps the free tools; a refused key stops the start', async () => {
    const { client } = await connect({ UD_API_KEY: UNPAID_KEY });
    assert.equal((await names(client)).length, 57);
    await client.close();
    await assert.rejects(() => prepareServer(readConfig({ UD_API_BASE: fixture.base, UD_API_KEY: REFUSED_KEY }), { log: () => {} }), (error) => error instanceof ConfigError && /UD_API_KEY was refused: This key was revoked/u.test(error.message));
});

test('the member key travels as Bearer in the local profile', async () => {
    const { client } = await connect({ UD_API_KEY: FOUNDER_KEY });
    const before = fixture.requests.length;
    await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'ai' } });
    const sent = fixture.requests.slice(before).find((request) => request.path === '/tlds/ai');
    assert.equal(sent.headers.authorization, `Bearer ${FOUNDER_KEY}`);
    assert.equal(sent.headers['x-ud-connector-secret'], undefined);
    await client.close();
});

test('a call answers structuredContent, one line, then the same JSON as text', async () => {
    const { client } = await connect({});
    const result = await client.callTool({ name: 'ud_get_name', arguments: { name: 'harbor.io' } });
    assert.equal(result.isError, undefined);
    assert.equal(result.structuredContent.data.name, 'harbor.io');
    assert.match(result.content[0].text, /^Stored answer for one domain name: harbor\.io/u);
    assert.deepEqual(JSON.parse(result.content[1].text), result.structuredContent);
    assert.ok('register' in result.structuredContent.links, 'the local profile keeps the links');
    await client.close();
});

test('the recorded answers validate against their output schemas (the client checks each)', async () => {
    const { client } = await connect({});
    for (const [name, args] of [
        ['ud_list_tlds', { limit: 3 }],
        ['ud_get_tld', { tld: 'ai' }],
        ['ud_list_domains', {}],
        ['ud_list_registrar_prices', { registrar: 'namecheap' }],
        ['ud_get_venue', { id: 'afternic' }],
        ['ud_get_latest_edition', { persona: 'founder' }],
        ['ud_get_market_sales', {}],
        ['ud_list_trends', { limit: 2 }],
    ]) {
        const result = await client.callTool({ name, arguments: args });
        assert.equal(result.isError, undefined, `${name}: ${result.content[0].text}`);
    }
    await client.close();
});

test('refusals are sentences an assistant can act on', async () => {
    const { client } = await connect({ UD_API_KEY: INVESTOR_KEY });
    const text = async (name, args) => {
        const result = await client.callTool({ name, arguments: args });
        assert.equal(result.isError, true, name);
        return result.content[0].text;
    };
    assert.equal(
        await text('ud_get_name_registry_history', { name: 'plan.io' }),
        'This endpoint comes with the Investor plan. This tool comes with the Investor plan; move to Investor at https://app.unique.domains/home?upgrade=investor.',
    );
    assert.equal(await text('ud_get_name_prices', { name: 'quota.io' }), "This key's month is spent. The allowance starts again on 1 December 2026.");
    assert.equal(await text('ud_get_tld', { tld: 'spent' }), "The connector's day is spent. It resets at 00:00 UTC (in about 7 hours).");
    assert.equal(await text('ud_get_tld', { tld: 'down' }), 'The API is restarting. Try again in a minute.');
    assert.equal(await text('ud_get_name', { name: 'missing.io' }), 'No fixture answers GET /names/missing.io.');
    assert.match(await text('ud_get_name', {}), /^`name` is required/u);
    assert.match(await text('ud_nope', {}), /There is no tool named ud_nope/u);
    await client.close();
});

test('a short 429 is retried once; a long one is told with its reset', async () => {
    const waits = [];
    const { client } = await connect({}, { sleep: async (ms) => void waits.push(ms) });
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'busy' } });
    assert.equal(result.isError, undefined);
    assert.deepEqual(waits, [2000]);
    await client.close();
});

test('a 202 says the answer is not ready and when to call again', async () => {
    const { client } = await connect({ UD_API_KEY: FOUNDER_KEY });
    const result = await client.callTool({ name: 'ud_check_name', arguments: { name: 'slow.io' } });
    assert.equal(result.isError, undefined);
    assert.match(result.content[0].text, /^Not ready yet: .* again in about 30 seconds\./u);
    await client.close();
});

test('the API unreachable: a sentence, not a crash', async () => {
    const prepared = await prepareServer(readConfig({ UD_API_BASE: 'http://127.0.0.1:9/v1' }), { log: () => {} });
    const server = createMcpServer(prepared);
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' });
    await Promise.all([client.connect(clientSide), server.connect(serverSide)]);
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'ai' } });
    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'The Unique Domains API did not answer. Try again in a minute.');
    await client.close();
});
