#!/usr/bin/env node
/*----------------------------------
- MCP INSPECTOR SMOKE
----------------------------------*/

/**
 * Runs the MCP Inspector's command line against the built server, both transports (plan section 2, "an MCP Inspector
 * smoke in CI against the fixture"):
 *
 *   stdio   `node dist/stdio.js`, local profile: tools/list (55, schema check `--strict`), then `ud_get_name`
 *   http    `node dist/http.js` on a free port, hosted profile: tools/list (51, `--strict`), then `ud_get_name`
 *
 *   npm run smoke              against the fixture API (`test/support/api-fixture.mjs`), offline
 *   npm run smoke -- --live    against https://api.unique.domains/v1 (keyless), plus one hosted call per tool whose
 *                              description shows a sample ("Pass `x` (such as ...)"), with that sample: an error, a
 *                              null `data`, an empty list or an object of nulls and empty lists fails, so a sample that
 *                              stops answering, or answers nothing, shows (plan `never-where-data-comes-from`, M7)
 *
 * The Inspector is pinned at a version at least two weeks old; `npx -y` fetches it on the first run.
 */

import { execFile, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { TOOLS } from '../dist/index.js';
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

/** The samples a description shows, as the built tool says them: `Pass \`tld\` (such as web)` gives `{ tld: 'web' }`. */
const samplesOf = (description) => Object.fromEntries([...description.matchAll(/`([A-Za-z]+)` \(such as ([^)\s]+)\)/gu)].map((match) => [match[1], match[2]]));

/** A value that says nothing: null, false, 0, an empty string or list, or an object of such values. */
const isBlank = (value) =>
    value === null ||
    value === undefined ||
    value === false ||
    value === 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.values(value).every(isBlank));

/**
 * Nothing to read: null, an empty list, an answer for a name outside the catalog (`tracked: false`, or `read: false`
 * on a record), or an object whose every value is blank once the sample it echoes is set aside (`{ string: 'account',
 * applications: [] }`). A sample name that leaves the catalog turns the smoke red (review of 2026-11-13).
 */
const isEmptyAnswer = (data, samples) => {
    if (data === null || data === undefined) return true;
    if (Array.isArray(data)) return data.length === 0;
    if (typeof data !== 'object') return false;
    if (data.tracked === false || data.read === false) return true;
    const echoed = new Set(Object.values(samples));
    return Object.values(data).every((value) => echoed.has(value) || isBlank(value));
};

/**
 * The one sample tool whose empty answer is the true one: `ud_get_name_auction` answers null for a name not at auction,
 * and any fixed name leaves auction within days (plan `never-where-data-comes-from`, decision D-d). It must still answer.
 */
const EMPTY_ANSWER_ALLOWED = ['ud_get_name_auction'];

/** A hosted answer never names how a record was read (Gaetan's 2A of 2026-11-13, step M7b). */
const carriesTransport = (call) => JSON.stringify(call.structuredContent ?? {}).includes('"transport":');

const fixture = live ? null : await startApiFixture();
const apiBase = fixture ? fixture.base : 'https://api.unique.domains/v1';
let http = null;
try {
    /* ---------- stdio, local profile ---------- */
    const stdio = ['-e', `UD_API_BASE=${apiBase}`, 'node', 'dist/stdio.js'];
    const stdioList = await inspector(stdio, 'tools/list', ['--strict']);
    expect(stdioList.tools.length === 55, `stdio tools/list answers 55 tools (${stdioList.tools.length})`);
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

    // The hosted trim (fix round A2): no internal id, no computing stamp, no time but an auction's deadline. The registry
    // record is the one answer that carries `transport` (its recording does), so its "no transport" line can fail (review
    // m3 of 2026-11-14).
    for (const [tool, args] of [['ud_get_name', ['name=get.plumbing']], ['ud_get_name_registry', ['name=get.plumbing']], ['ud_get_agenda', []], ['ud_list_price_changes', []]]) {
        const call = await inspector(url, 'tools/call', ['--tool-name', tool, ...args.flatMap((arg) => ['--tool-arg', arg])]);
        const text = JSON.stringify(call.structuredContent);
        expect(!call.isError, `http ${tool} answers`);
        expect(!/"(?:id|[a-z]+Id)":"(?:dom_|wrd_|[0-9a-f]{8}-[0-9a-f]{4}-|\d+")/u.test(text) && !/"(?:computedAt|rollupAt)"/u.test(text), `http ${tool} carries no internal id or stamp`);
        expect(!/"(?!endsAt")[A-Za-z]+":"\d{4}-\d{2}-\d{2}T/u.test(text), `http ${tool} carries days, not times`);
        expect(!carriesTransport(call), `http ${tool} carries no "transport"`);
    }
    // Every sample a hosted description shows answers on production with something to read (review M1 of 2026-11-11,
    // plan `never-where-data-comes-from` M7), and an edition is the persona asked. The samples come from the built tool,
    // so the smoke and the description cannot differ.
    if (live) {
        const sampled = TOOLS.filter((tool) => tool.hosted).map((tool) => ({ tool: tool.name, samples: samplesOf(tool.description) })).filter(({ samples }) => Object.keys(samples).length > 0);
        expect(sampled.length > 0, `${sampled.length} hosted tools show a sample`);
        // A sample with a space or a bracket would not parse, and its tool would be skipped without a word.
        for (const tool of TOOLS.filter((entry) => entry.hosted)) {
            const samples = samplesOf(tool.description);
            const missing = (tool.inputSchema.required ?? []).filter((name) => !(name in samples));
            expect(missing.length === 0, `http ${tool.name} shows a sample for every required input${missing.length > 0 ? ` (not ${missing.join(', ')})` : ''}`);
        }
        for (const { tool, samples } of sampled) {
            const call = await inspector(url, 'tools/call', ['--tool-name', tool, ...Object.entries(samples).flatMap(([name, value]) => ['--tool-arg', `${name}=${value}`])]);
            const data = call.structuredContent?.data;
            const shown = Object.entries(samples).map(([name, value]) => `${name}=${value}`).join(' ');
            expect(!call.isError && call.structuredContent !== undefined, `http ${tool} answers its description's sample (${shown})`);
            if (!EMPTY_ANSWER_ALLOWED.includes(tool)) expect(!isEmptyAnswer(data, samples), `http ${tool} answers something for ${shown}`);
            if (samples.persona !== undefined) expect(data?.persona === samples.persona, `http ${tool} answers the persona asked`);
            expect(!carriesTransport(call), `http ${tool} carries no "transport"`);
        }
    }

    // An unknown tool is a JSON-RPC error -32602 (fix round A5). Sent raw: the Inspector refuses a tool its list lacks
    // before it reaches the server.
    // `ud_get_meta_freshness` left the server in 0.1.6 (Gaetan's 3B of 2026-11-13): a client that still calls it gets the same.
    for (const name of ['ud_no_such_tool', 'ud_get_meta_freshness']) {
        const unknown = await fetch(`http://127.0.0.1:${port}/mcp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
            body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: {} } }),
        }).then((response) => response.json());
        expect(unknown.error?.code === -32602 && unknown.result === undefined, `http ${name} answers -32602`);
    }
} finally {
    http?.kill();
    await fixture?.close();
}
