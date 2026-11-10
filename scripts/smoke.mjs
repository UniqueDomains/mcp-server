#!/usr/bin/env node
/*----------------------------------
- MCP INSPECTOR SMOKE
----------------------------------*/

/**
 * Runs the MCP Inspector's command line against the built server, both transports (plan section 2, "an MCP Inspector
 * smoke in CI against the fixture"):
 *
 *   stdio   `node dist/stdio.js`, local profile: tools/list (56, schema check `--strict`), then `ud_get_name`
 *   http    `node dist/http.js` on a free port, hosted profile: tools/list (51, `--strict`), then `ud_get_name`
 *
 *   npm run smoke              against the fixture API (`test/support/api-fixture.mjs`), offline
 *   npm run smoke -- --live    against https://api.unique.domains/v1 (keyless)
 *
 * The Inspector is pinned at a version at least two weeks old; `npx -y` fetches it on the first run.
 */

import { execFile, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { startApiFixture } from '../test/support/api-fixture.mjs';

const INSPECTOR = '@modelcontextprotocol/inspector@2.12.0';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const live = process.argv.includes('--live');
const run = promisify(execFile);

const freePort = () =>
    new Promise((resolve) => {
        const server = createServer();
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
    });

/** The environment without a member key: the smoke checks the keyless tool sets. */
const { UD_API_KEY: _ignored, ...keylessEnv } = process.env;

const inspector = async (target, method, extra = []) => {
    const args = ['-y', INSPECTOR, '--cli', ...target, '--method', method, ...extra];
    const { stdout } = await run('npx', args, { cwd: ROOT, env: keylessEnv, maxBuffer: 64 * 1024 * 1024 });
    return JSON.parse(stdout);
};

const expect = (condition, message) => {
    if (!condition) throw new Error(`Smoke failed: ${message}`);
    console.log(`ok  ${message}`);
};

const fixture = live ? null : await startApiFixture();
const apiBase = fixture ? fixture.base : 'https://api.unique.domains/v1';
let http = null;
try {
    /* ---------- stdio, local profile ---------- */
    const stdio = ['-e', `UD_API_BASE=${apiBase}`, 'node', 'dist/stdio.js'];
    const stdioList = await inspector(stdio, 'tools/list', ['--strict']);
    expect(stdioList.tools.length === 56, `stdio tools/list answers 56 tools (${stdioList.tools.length})`);
    const stdioCall = await inspector(stdio, 'tools/call', ['--tool-name', 'ud_get_name', '--tool-arg', 'name=get.plumbing']);
    expect(!stdioCall.isError && stdioCall.structuredContent.data.name === 'get.plumbing', 'stdio ud_get_name answers get.plumbing');

    /* ---------- HTTP, hosted profile ---------- */
    const port = await freePort();
    http = spawn(process.execPath, ['dist/http.js'], {
        cwd: ROOT,
        env: { ...keylessEnv, PORT: String(port), UD_MCP_PROFILE: 'hosted', UD_API_BASE: apiBase },
        stdio: ['ignore', 'pipe', 'inherit'],
    });
    await new Promise((resolve, reject) => {
        http.stdout.on('data', (chunk) => String(chunk).includes(` on :${port}`) && resolve());
        http.on('exit', (code) => reject(new Error(`dist/http.js exited with ${code}`)));
    });
    const url = [`http://127.0.0.1:${port}/mcp`, '--transport', 'http'];
    const httpList = await inspector(url, 'tools/list', ['--strict']);
    expect(httpList.tools.length === 51, `http tools/list answers 51 tools (${httpList.tools.length})`);
    const httpCall = await inspector(url, 'tools/call', ['--tool-name', 'ud_get_name', '--tool-arg', 'name=get.plumbing']);
    const links = httpCall.structuredContent.links;
    expect(!httpCall.isError && links.details === 'https://unique.domains/availability/get.plumbing', 'http ud_get_name carries links.details');
    expect(!('register' in links) && !('product' in links), 'http answers carry no register or product link');

    // The hosted trim (fix round A2): no internal id, no computing stamp, no time but an auction's deadline.
    for (const [tool, args] of [['ud_get_name', ['name=get.plumbing']], ['ud_get_agenda', []], ['ud_list_price_changes', []]]) {
        const call = await inspector(url, 'tools/call', ['--tool-name', tool, ...args.flatMap((arg) => ['--tool-arg', arg])]);
        const text = JSON.stringify(call.structuredContent);
        expect(!call.isError, `http ${tool} answers`);
        expect(!/"(?:id|[a-z]+Id)":"(?:dom_|wrd_|[0-9a-f]{8}-[0-9a-f]{4}-|\d+")/u.test(text) && !/"(?:computedAt|rollupAt)"/u.test(text), `http ${tool} carries no internal id or stamp`);
        expect(!/"(?!endsAt")[A-Za-z]+":"\d{4}-\d{2}-\d{2}T/u.test(text), `http ${tool} carries days, not times`);
    }
    // An unknown tool is a JSON-RPC error -32602 (fix round A5). Sent raw: the Inspector refuses a tool its list lacks
    // before it reaches the server.
    const unknown = await fetch(`http://127.0.0.1:${port}/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'ud_no_such_tool', arguments: {} } }),
    }).then((response) => response.json());
    expect(unknown.error?.code === -32602 && unknown.result === undefined, 'http an unknown tool answers -32602');
} finally {
    http?.kill();
    await fixture?.close();
}
