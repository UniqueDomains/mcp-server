/*----------------------------------
- THE HTTP TRANSPORT, HOSTED PROFILE
----------------------------------*/

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

import { createRequestHandler, prepareServer, readConfig, readWellKnownFiles, ConfigError } from '../dist/index.js';
import { FOUNDER_KEY, problem, startApiFixture } from './support/api-fixture.mjs';

const SECRET = 's'.repeat(40);
let fixture;
let http;
let base;

before(async () => {
    fixture = await startApiFixture({
        'GET /tlds/spent': problem(429, 'budget_spent', "The connector's day is spent.", { headers: { 'Retry-After': '3600' } }),
        'GET /tlds/keyed': problem(403, 'keyed_only', 'The free answer of this endpoint is a fixed cut: `limit` and `cursor` need a paid subscription.'),
    });
    const env = {
        UD_MCP_PROFILE: 'hosted',
        UD_API_BASE: fixture.base,
        UD_API_KEY: FOUNDER_KEY,
        UD_CONNECTOR_SECRET: SECRET,
        UD_WELLKNOWN_FILES: JSON.stringify({
            'openai-apps-challenge': 'challenge-token',
            'mcp-registry-auth': 'v=MCPv1; k=ed25519; p=abc',
            'glama.json': { body: '{"$schema":"https://glama.ai/mcp/schemas/connector.json","maintainers":[{"email":"x@unique.domains"}]}', contentType: 'application/json' },
        }),
    };
    const prepared = await prepareServer(readConfig(env), { log: () => {} });
    http = createServer(createRequestHandler(prepared, { wellKnown: readWellKnownFiles(env) }));
    await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${http.address().port}`;
});
after(async () => {
    await new Promise((resolve) => http.close(resolve));
    await fixture.close();
});

const connect = async () => {
    const client = new Client({ name: 'test', version: '0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp`)));
    return client;
};

test('initialize and tools/list: 54 tools, never the three one-a-day ones, whatever the key in the environment', async () => {
    const client = await connect();
    assert.equal(client.getServerVersion().name, 'uniquedomains');
    const { tools } = await client.listTools();
    assert.equal(tools.length, 54);
    for (const name of ['ud_get_market_sales_word', 'ud_get_word_market', 'ud_list_tld_prices', 'ud_get_key', 'ud_check_name']) assert.ok(!tools.some((tool) => tool.name === name), name);
    for (const tool of tools) {
        assert.ok(tool.title && tool.annotations.readOnlyHint === true && tool.annotations.openWorldHint === false, tool.name);
        assert.equal(tool.outputSchema.properties.links.properties.register, undefined);
    }
    await client.close();
});

test('a call: details set, no register or product, the connector secret sent and no Authorization', async () => {
    const client = await connect();
    const before = fixture.requests.length;
    const result = await client.callTool({ name: 'ud_get_name', arguments: { name: 'harbor.io' } });
    assert.equal(result.isError, undefined);
    assert.equal(result.structuredContent.links.details, 'https://unique.domains/availability/harbor.io');
    assert.ok(!('register' in result.structuredContent.links) && !('product' in result.structuredContent.links));
    assert.ok(!result.content[1].text.includes('"register"') && !result.content[1].text.includes('"product"'));
    const sent = fixture.requests.slice(before).find((request) => request.path === '/names/harbor.io');
    assert.equal(sent.headers['x-ud-connector-secret'], SECRET);
    assert.equal(sent.headers.authorization, undefined);
    await client.close();
});

test('a problem: the budget refusal tells when it resets and that the allowance is shared', async () => {
    const client = await connect();
    const result = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'spent' } });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /^The connector's day is spent\. This connector shares one daily allowance among its users\. It resets at \d\d:\d\d UTC \(in about 60 minutes\)\.$/u);
    await client.close();
});

test('the hosted connector carries no plan talk: no keyed input listed, a keyed refusal without the paid tiers', async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    for (const tool of tools) {
        const text = JSON.stringify(tool.inputSchema);
        assert.ok(!/paid|subscription|member key/iu.test(text), `${tool.name} input schema`);
        assert.ok(!/"score"|\bscores?\b|\branking\b/iu.test(JSON.stringify(tool.outputSchema)), `${tool.name} output schema`);
    }
    const refused = await client.callTool({ name: 'ud_get_tld', arguments: { tld: 'keyed' } });
    assert.equal(refused.content[0].text, 'This connector serves the free answers only, and that input or page is not one of them. Call the tool again without it.');
    const keyedInput = await client.callTool({ name: 'ud_list_domains', arguments: { prefix: 'har' } });
    assert.equal(keyedInput.content[0].text, 'This connector does not take `prefix`. Call the tool again without it.');
    await client.close();
});

test('the well-known files, /healthz, CORS, no-store, 405 and 413', async () => {
    const challenge = await fetch(`${base}/.well-known/openai-apps-challenge`);
    assert.equal(challenge.status, 200);
    assert.equal(await challenge.text(), 'challenge-token');
    assert.match(challenge.headers.get('content-type'), /^text\/plain/u);
    assert.equal((await fetch(`${base}/.well-known/mcp-registry-auth`).then((response) => response.text())), 'v=MCPv1; k=ed25519; p=abc');
    const glama = await fetch(`${base}/.well-known/glama.json`);
    assert.equal(glama.headers.get('content-type'), 'application/json');
    assert.equal((await fetch(`${base}/.well-known/other`)).status, 404);

    const health = await fetch(`${base}/healthz`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true, version: '0.1.0', tools: 54 });
    assert.equal(health.headers.get('cache-control'), 'no-store');

    const get = await fetch(`${base}/mcp`);
    assert.equal(get.status, 405);
    assert.equal(get.headers.get('access-control-allow-origin'), '*');
    const preflight = await fetch(`${base}/mcp`, { method: 'OPTIONS' });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), '*');

    const post = await fetch(`${base}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
    });
    assert.equal(post.status, 200);
    assert.equal(post.headers.get('cache-control'), 'no-store');
    assert.equal(post.headers.get('access-control-allow-origin'), '*');
    assert.match(post.headers.get('content-type'), /^application\/json/u);
    assert.equal((await post.json()).result.tools.length, 54);

    const big = await fetch(`${base}/mcp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: `{"x":"${'a'.repeat(1024 * 1024 + 10)}"}` });
    assert.equal(big.status, 413);
    // A chunked body (no Content-Length) over the limit gets its 413 too, not a reset connection (review finding 6).
    const chunked = new ReadableStream({
        start(controller) {
            for (let index = 0; index < 20; index++) controller.enqueue(new TextEncoder().encode('a'.repeat(64 * 1024)));
            controller.close();
        },
    });
    const streamed = await fetch(`${base}/mcp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: chunked, duplex: 'half' });
    assert.equal(streamed.status, 413);
    const bad = await fetch(`${base}/mcp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{nope' });
    assert.equal(bad.status, 400);
});

test('UD_WELLKNOWN_FILES must be a JSON object of file names', () => {
    assert.throws(() => readWellKnownFiles({ UD_WELLKNOWN_FILES: '[1]' }), ConfigError);
    assert.throws(() => readWellKnownFiles({ UD_WELLKNOWN_FILES: '{"../x":"y"}' }), ConfigError);
    assert.equal(readWellKnownFiles({ UD_WELLKNOWN_FILES: '{"/.well-known/a":"b"}' }).get('a').body, 'b');
    assert.equal(readWellKnownFiles({}).size, 0);
});
