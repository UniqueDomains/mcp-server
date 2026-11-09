/*----------------------------------
- THE DIRECTORY FILES AND THE PLUGIN PACKAGE
----------------------------------*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const pkg = read('package.json');
const server = read('server.json');

test('server.json follows the registry schema of 2025-12-11, and its name is the package mcpName', () => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(read('test/fixtures/server.schema.json'));
    assert.ok(validate(server), JSON.stringify(validate.errors));
    assert.equal(server.name, 'domains.unique/mcp-server');
    assert.equal(pkg.mcpName, server.name);
    assert.ok(server.description.length >= 1 && server.description.length <= 100);
    assert.equal(server.version, pkg.version);
    assert.equal(server.packages[0].identifier, pkg.name);
    assert.equal(server.packages[0].version, pkg.version);
    assert.deepEqual(server.remotes, [{ type: 'streamable-http', url: 'https://mcp.unique.domains/mcp' }]);
    for (const icon of server.icons) assert.ok(icon.src.startsWith('https://') && icon.src.length <= 255);
});

test('package.json: the repository exactly, MIT, public, Node 20, one bin', () => {
    assert.equal(pkg.repository.url, 'git+https://github.com/UniqueDomains/mcp-server.git');
    assert.equal(pkg.license, 'MIT');
    assert.equal(pkg.publishConfig.access, 'public');
    assert.equal(pkg.engines.node, '>=20');
    assert.deepEqual(Object.keys(pkg.bin), ['uniquedomains-mcp-server']);
    assert.match(readFileSync(join(ROOT, 'dist', 'stdio.js'), 'utf8'), /^#!\/usr\/bin\/env node/u);
});

test('glama.json names a maintainer; the Cursor plugin and its mcp.json point at the hosted connector', () => {
    assert.ok(read('glama.json').maintainers.length > 0);
    const cursor = read('.cursor-plugin/plugin.json');
    assert.match(cursor.name, /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/u);
    assert.equal(cursor.version, pkg.version);
    assert.deepEqual(read('mcp.json'), { mcpServers: { uniquedomains: { url: 'https://mcp.unique.domains/mcp' } } });
});

test('the README carries the Cursor install link with the hosted config in base64', () => {
    const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
    const config = Buffer.from(JSON.stringify({ url: 'https://mcp.unique.domains/mcp' })).toString('base64');
    assert.ok(readme.includes(`cursor://anysphere.cursor-deeplink/mcp/install?name=uniquedomains&config=${config}`));
});

test('the ChatGPT plugin package builds, and a field over its limit fails the build', () => {
    const out = mkdtempSync(join(tmpdir(), 'ud-plugin-'));
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'plugin-manifest.mjs'), '--out', out], { cwd: ROOT, stdio: 'pipe' });
    const zip = readFileSync(join(out, 'chatgpt-plugin.zip'));
    for (const name of ['plugin.json', 'mcp.json', 'skills/unique-domains/SKILL.md', 'assets/logo.png', 'assets/composer-icon.png']) assert.ok(zip.includes(Buffer.from(name)), name);
    const sheet = JSON.parse(readFileSync(join(out, 'chatgpt-plugin-review.json'), 'utf8'));
    assert.equal(sheet.positiveTests.length, 5);
    assert.equal(sheet.negativeTests.length, 3);
    assert.equal(sheet.tools.length, 54);

    const review = read('plugin/review.json');
    const bad = join(out, 'review.json');
    writeFileSync(bad, JSON.stringify({ ...review, displayName: 'A display name of more than thirty characters', negativeTests: review.negativeTests.slice(0, 2) }));
    assert.throws(
        () => execFileSync(process.execPath, [join(ROOT, 'scripts', 'plugin-manifest.mjs'), '--review', bad, '--out', out], { cwd: ROOT, stdio: 'pipe' }),
        (error) => /displayName/u.test(String(error.stderr)) && /negativeTests/u.test(String(error.stderr)),
    );
});
