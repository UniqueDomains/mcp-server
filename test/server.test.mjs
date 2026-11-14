/*----------------------------------
- THE SERVER: KEY BOOT, CALLS, REFUSALS
----------------------------------*/

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from 'node:http';

import { createMcpServer, instructionsFor, prepareServer, readConfig, ConfigError } from '../dist/index.js';
import { whereDataComesFromIn } from '../scripts/lib/tools.mjs';
import { FOUNDER_KEY, INVESTOR_KEY, REFUSED_KEY, UNPAID_KEY, problem, startApiFixture } from './support/api-fixture.mjs';

let fixture;
const NOW = new Date('2026-11-09T17:00:00Z');

before(async () => {
    fixture = await startApiFixture({
        'GET /names/plan.io/registry/history': problem(403, 'plan_required', 'This endpoint comes with the Investor plan.', {
            body: { product: 'https://app.unique.domains/home?upgrade=investor' },
        }),
        'GET /names/quota.io/prices': problem(429, 'quota_spent', "This key's month is spent.", {
            headers: { 'X-Quota-Limit': '10000', 'X-Quota-Remaining': '0', 'X-Quota-Reset': '1796083200', 'Retry-After': '60' },
        }),
        'GET /tlds/busy': [problem(429, 'rate_limited', 'Too many calls this second.', { headers: { 'Retry-After': '2' } }), { status: 200, body: { data: { tld: 'busy' }, meta: {}, links: {} } }],
        'GET /tlds/spent': problem(429, 'budget_spent', "The connector's day is spent.", { headers: { 'Retry-After': '25200' } }),
        'GET /tlds/down': problem(503, 'internal', 'The API is restarting.'),
        'GET /tlds/badshape': { status: 200, body: { data: 'not an object', meta: { asOf: 12 }, links: {} } },
        'GET /tlds/second': [problem(429, 'rate_limited', 'Too many calls this second.', { headers: { 'Retry-After': '1' } }), problem(429, 'rate_limited', 'Too many calls this second.', { headers: { 'Retry-After': '1' } }), { status: 200, body: { data: { tld: 'second' }, meta: {}, links: {} } }],
        'POST /words/fresh/request': { status: 202, headers: { 'Content-Type': 'application/json', 'Retry-After': '600' }, body: { data: { status: 'accepted', requestId: '7f1c2d3e-0000-4000-8000-000000000001' }, meta: {}, links: {} } },
        'POST /names/slow.io/appraise': { status: 202, headers: { 'Content-Type': 'application/json', 'Retry-After': '30', Location: '/v1/names/slow.io/value' }, body: { data: { name: 'slow.io', current: null }, meta: {}, links: {} } },
        // A registry record with its format (Gaetan's 2A of 2026-11-13): the hosted profile drops `transport`, the local one keeps it.
        'GET /names/rdap.io/registry': { status: 200, body: { data: { read: true, observedOn: '2026-09-23', registrar: { name: 'GoDaddy.com, LLC', ianaId: 146 }, transport: 'rdap' }, meta: { asOf: '2026-09-23' }, links: {} } },
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

test('without a key: the 55 free tools, and no get_key call', async () => {
    const before = fixture.requests.length;
    const { client } = await connect({});
    assert.equal((await names(client)).length, 55);
    assert.equal(fixture.requests.slice(before).filter((request) => request.path === '/meta/key').length, 0);
    await client.close();
});

test('a Founder key adds the keyed tools without the Investor set', async () => {
    const { client } = await connect({ UD_API_KEY: FOUNDER_KEY });
    const list = await names(client);
    assert.ok(list.includes('ud_get_name_prices') && list.includes('ud_get_key') && list.includes('ud_check_name'));
    assert.ok(!list.includes('ud_batch_names') && !list.includes('ud_appraise_name'));
    assert.ok(list.includes('ud_get_word_notability') && list.includes('ud_get_word_market'));
    assert.equal(list.length, 65);
    await client.close();
});

test('an Investor key shows every tool', async () => {
    const { client } = await connect({ UD_API_KEY: INVESTOR_KEY });
    assert.equal((await names(client)).length, 80);
    await client.close();
});

test('a key with no paid plan keeps the free tools; a refused key stops the start', async () => {
    const { client } = await connect({ UD_API_KEY: UNPAID_KEY });
    assert.equal((await names(client)).length, 55);
    // The key that opens no plan goes no further than the start: calls leave without it, and a keyed input says why.
    const before = fixture.requests.length;
    assert.equal((await client.callTool({ name: 'ud_get_name', arguments: { name: 'harbor.io' } })).isError, undefined);
    const sent = fixture.requests.slice(before).find((request) => request.path === '/names/harbor.io');
    assert.equal(sent.headers.authorization, undefined);
    const keyedInput = await client.callTool({ name: 'ud_list_domains', arguments: { prefix: 'har' } });
    assert.match(keyedInput.content[0].text, /^`prefix` needs a member key on a paid plan, and UD_API_KEY opens none/u);
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
    assert.match(result.content[0].text, /^Answer for one domain name: harbor\.io/u);
    assert.deepEqual(JSON.parse(result.content[1].text), result.structuredContent);
    assert.ok('register' in result.structuredContent.links, 'the local profile keeps the links');
    await client.close();
});

// Gaetan's 8A of 2026-11-14 (decision 34): a name outside the catalog never reads "status not checked".
test('the text line of a name outside the catalog says there is no answer; a tracked name keeps its status (local)', async () => {
    const { client } = await connect({});
    const outside = await client.callTool({ name: 'ud_get_name', arguments: { name: 'harbor.io' } });
    assert.equal(outside.structuredContent.data.tracked, false);
    assert.equal(outside.content[0].text, 'Answer for one domain name: harbor.io, no answer in the catalog; the name may be taken.');
    const tracked = await client.callTool({ name: 'ud_get_name', arguments: { name: 'get.plumbing' } });
    assert.equal(tracked.structuredContent.data.tracked, true);
    assert.equal(tracked.content[0].text, 'Answer for one domain name: get.plumbing, status for sale.');
    await client.close();
});

test('the recorded answers validate against their output schemas, both profiles (the client checks each)', async () => {
    // The MCP Client validates structuredContent only for the tools its listTools() cached (review finding 5).
    for (const profile of ['local', 'hosted']) {
    const { client } = await connect({ UD_MCP_PROFILE: profile });
    await client.listTools();
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
        assert.equal(result.isError, undefined, `${profile} ${name}: ${result.content[0].text}`);
    }
    // A wrong answer shape is caught: the check is live, not assumed.
    await assert.rejects(() => client.callTool({ name: 'ud_get_tld', arguments: { tld: 'badshape' } }), /structured content does not match/iu);
    await client.close();
    }
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
    // An unknown tool is a JSON-RPC error (-32602), not a tool result (2025-11-25 Tools page, "Unknown tools").
    await assert.rejects(() => client.callTool({ name: 'ud_nope', arguments: {} }), (error) => error.code === -32602 && /There is no tool named ud_nope/u.test(error.message));
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

test('a 202 never advises a call that spends another unit', async () => {
    const { client } = await connect({ UD_API_KEY: INVESTOR_KEY });
    const check = await client.callTool({ name: 'ud_check_name', arguments: { name: 'slow.io' } });
    assert.equal(check.isError, undefined);
    assert.match(check.content[0].text, /^Not ready yet: .* Read it with ud_get_name in about 30 seconds; calling ud_check_name again spends another live check\./u);
    const word = await client.callTool({ name: 'ud_request_word', arguments: { word: 'fresh' } });
    assert.match(word.content[0].text, /^Queued: .* Follow it with ud_get_word_request with requestId 7f1c2d3e-0000-4000-8000-000000000001 in about 600 seconds\./u);
    await client.close();
});

// Plan `never-where-data-comes-from`, step M4: neither "Not ready yet" sentence names the scanner.
test('a 202 says what is still running, never who runs it', async () => {
    const { client } = await connect({ UD_API_KEY: INVESTOR_KEY });
    const check = await client.callTool({ name: 'ud_check_name', arguments: { name: 'slow.io' } });
    assert.match(check.content[0].text, /^Not ready yet: the check of the name is still running\. Read it with ud_get_name in about 30 seconds/u);
    const appraisal = await client.callTool({ name: 'ud_appraise_name', arguments: { name: 'slow.io' } });
    assert.match(appraisal.content[0].text, /^Not ready yet: the answer is still being prepared\. Call this tool again in about 30 seconds\./u);
    for (const result of [check, appraisal]) assert.deepEqual(whereDataComesFromIn(result.content[0].text), []);
    await client.close();
});

// Step M3: both profiles' guides say the same, and neither says where the data comes from or how old it is (17A).
test('the guide is the same on both profiles and says neither where the data comes from nor its day', async () => {
    assert.equal(instructionsFor('local'), instructionsFor('hosted'));
    for (const profile of ['local', 'hosted']) {
        const guide = instructionsFor(profile);
        assert.deepEqual(whereDataComesFromIn(guide), [], guide);
        assert.match(guide, / `links\.details` points at the public page about the subject when there is one\. /u);
        assert.doesNotMatch(guide, /\bday\b/u);
    }
    const { client } = await connect({});
    assert.equal(client.getInstructions(), instructionsFor('local'));
    await client.close();
});

// Step M7b: only the hosted connector drops `transport`; the npm server answers what the API answers.
test('the local profile keeps the registry record\'s transport', async () => {
    const { client } = await connect({});
    const result = await client.callTool({ name: 'ud_get_name_registry', arguments: { name: 'rdap.io' } });
    assert.equal(result.isError, undefined);
    assert.equal(result.structuredContent.data.transport, 'rdap');
    await client.close();
});

test('a one-second 429 is not retried again by the server (the SDK retried it once)', async () => {
    const waits = [];
    const { client } = await connect({}, { sleep: async (ms) => void waits.push(ms) });
    const before = fixture.requests.length;
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'second' } });
    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'Too many calls this second. It resets at 17:00 UTC (in about 1 second).');
    assert.deepEqual(waits, []);
    assert.equal(fixture.requests.slice(before).filter((request) => request.path === '/tlds/second').length, 2);
    await client.close();
});

test('without a key, the inputs only a key may send are hidden and refused before any call', async () => {
    const { client } = await connect({});
    const listDomains = (await client.listTools()).tools.find((tool) => tool.name === 'ud_list_domains');
    for (const name of ['sort', 'prefix', 'contains']) assert.equal(listDomains.inputSchema.properties[name], undefined, name);
    assert.equal(listDomains.inputSchema.properties.limit.description, 'Page size, 20 at most.');
    const before = fixture.requests.length;
    const result = await client.callTool({ name: 'ud_list_domains', arguments: { sort: 'price' } });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /^`sort` needs a member key/u);
    assert.equal(fixture.requests.length, before);
    await client.close();

    const keyed = await connect({ UD_API_KEY: FOUNDER_KEY });
    const withKey = (await keyed.client.listTools()).tools.find((tool) => tool.name === 'ud_list_domains');
    assert.ok(withKey.inputSchema.properties.sort);
    await keyed.client.close();
});

test('a path input that would move the request is refused', async () => {
    const { client } = await connect({});
    const result = await client.callTool({ name: 'ud_get_name', arguments: { name: '..' } });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /^`name` must be one path segment/u);
    await client.close();
});

test('the start does not wait on a hung API for the key: free tools after the timeout', { timeout: 20_000 }, async () => {
    const hung = createServer(() => {});
    await new Promise((resolve) => hung.listen(0, '127.0.0.1', resolve));
    const lines = [];
    const prepared = await prepareServer(readConfig({ UD_API_BASE: `http://127.0.0.1:${hung.address().port}/v1`, UD_API_KEY: FOUNDER_KEY }), { log: (line) => lines.push(line) });
    assert.equal(prepared.plan, 'none');
    assert.equal(prepared.tools.length, 55);
    assert.match(lines[0], /Starting with the free tools only/u);
    hung.closeAllConnections();
    await new Promise((resolve) => hung.close(resolve));
});

test('a hung call: a sentence after the call deadline, not a held request', { timeout: 10_000 }, async () => {
    const hung = createServer(() => {});
    await new Promise((resolve) => hung.listen(0, '127.0.0.1', resolve));
    const prepared = await prepareServer(readConfig({ UD_API_BASE: `http://127.0.0.1:${hung.address().port}/v1` }), { log: () => {} });
    const server = createMcpServer(prepared, { timeoutMs: 300 });
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' });
    await Promise.all([client.connect(clientSide), server.connect(serverSide)]);
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'ai' } });
    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'The Unique.domains API took too long to answer. Try again in a minute.');
    await client.close();
    hung.closeAllConnections();
    await new Promise((resolve) => hung.close(resolve));
});

test('the API unreachable: a sentence, not a crash', async () => {
    const prepared = await prepareServer(readConfig({ UD_API_BASE: 'http://127.0.0.1:9/v1' }), { log: () => {} });
    const server = createMcpServer(prepared);
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'test', version: '0' });
    await Promise.all([client.connect(clientSide), server.connect(serverSide)]);
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'ai' } });
    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'The Unique.domains API did not answer. Try again in a minute.');
    await client.close();
});

// The directory quality audit of 2026-11-11 (Gaetan's 3A): the hosted `limit: 5000` was refused "from 1 to 100" beside
// a schema that says 20, and a missing `name` repeated the API's status code and problem code.
test('a refusal repeats the bound and the words the tool shows, not the API document', async () => {
    const { client } = await connect({ UD_MCP_PROFILE: 'hosted' });
    await client.listTools();
    const limit = await client.callTool({ name: 'ud_list_domains', arguments: { limit: 5000 } });
    assert.equal(limit.isError, true);
    assert.match(limit.content[0].text, /`limit` must be a whole number from 1 to 20/u);
    const missing = await client.callTool({ name: 'ud_get_name', arguments: {} });
    assert.match(missing.content[0].text, /^`name` is required: A full domain name/u);
    assert.doesNotMatch(missing.content[0].text, /validation_failed|\b400\b/u);
    // AF-2: the refusal repeats the hosted schema, which dropped the `wrd_` id clause.
    for (const name of ['ud_get_word_endings', 'ud_get_word_notability']) {
        const word = await client.callTool({ name, arguments: {} });
        assert.match(word.content[0].text, /^`word` is required: The catalog slug or the word\./u, name);
        assert.doesNotMatch(word.content[0].text, /wrd_/u, name);
    }
    await client.close();
});
