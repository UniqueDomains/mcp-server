/*----------------------------------
- THE DIRECTORY FILES AND THE PLUGIN PACKAGE
----------------------------------*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { inflateRawSync } from 'node:zlib';
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

/** One file of a zip the builder wrote (local headers, deflate), by its name. */
const unzipEntry = (zip, wanted) => {
    let offset = 0;
    while (zip.readUInt32LE(offset) === 0x04034b50) {
        const size = zip.readUInt32LE(offset + 18);
        const nameLength = zip.readUInt16LE(offset + 26);
        const extraLength = zip.readUInt16LE(offset + 28);
        const name = zip.toString('utf8', offset + 30, offset + 30 + nameLength);
        const start = offset + 30 + nameLength + extraLength;
        if (name === wanted) return inflateRawSync(zip.subarray(start, start + size));
        offset = start + size;
    }
    return null;
};

test('the ChatGPT plugin package builds from the committed sheet, with the review keys OpenAI imports', () => {
    const out = mkdtempSync(join(tmpdir(), 'ud-plugin-'));
    // The committed sheet is the channels kit's copy (fix round A8): it builds without --allow-placeholder.
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'plugin-manifest.mjs'), '--out', out], { cwd: ROOT, stdio: 'pipe' });
    const zip = readFileSync(join(out, 'chatgpt-plugin.zip'));
    for (const name of ['plugin.json', 'mcp.json', 'skills/unique-domains/SKILL.md', 'assets/logo.png', 'assets/composer-icon.png']) assert.ok(zip.includes(Buffer.from(name)), name);
    const sheet = JSON.parse(readFileSync(join(out, 'chatgpt-plugin-review.json'), 'utf8'));
    assert.equal(sheet.positiveTests.length, 5);
    assert.equal(sheet.negativeTests.length, 3);
    assert.equal(sheet.tools.length, 51);

    const openai = JSON.parse(unzipEntry(zip, 'plugin.json').toString('utf8')).extensions['com.openai'];
    assert.equal(openai.interface.category, 'Data & Analytics');
    assert.equal(openai.review.test_cases.positive.length, 5);
    assert.equal(openai.review.test_cases.negative.length, 3);
    for (const test of openai.review.test_cases.positive) for (const key of ['description', 'prompt', 'tools_triggered', 'expected_behavior']) assert.ok(test[key], key);
    for (const test of openai.review.test_cases.negative) for (const key of ['description', 'prompt', 'expected_behavior']) assert.ok(test[key], key);
    assert.equal(openai.review.commerce, false);
    assert.ok(openai.publication.release_notes.includes('51 read-only tools'));
    // No demo recording yet, and no country list: both keys stay out, so the portal keeps its own values.
    assert.equal('demo_recording_url' in openai.review, false);
    assert.equal('countries' in openai.publication, false);
    assert.equal(read('plugin/review.json').placeholder, false);
});

test('a field over its limit, an unknown category or a hidden tool fails the build; a placeholder sheet needs the flag', () => {
    const out = mkdtempSync(join(tmpdir(), 'ud-plugin-'));
    const review = read('plugin/review.json');
    const build = (sheet, flags = []) => {
        const file = join(out, 'review.json');
        writeFileSync(file, JSON.stringify(sheet));
        return execFileSync(process.execPath, [join(ROOT, 'scripts', 'plugin-manifest.mjs'), '--review', file, '--out', out, ...flags], { cwd: ROOT, stdio: 'pipe' });
    };
    assert.throws(
        () => build({ ...review, displayName: 'A display name of more than thirty characters', negativeTests: review.negativeTests.slice(0, 2) }),
        (error) => /displayName/u.test(String(error.stderr)) && /negativeTests/u.test(String(error.stderr)),
    );
    assert.throws(() => build({ ...review, category: 'Research' }), (error) => /category: one of Productivity/u.test(String(error.stderr)));
    const hidden = { ...review.positiveTests[0], tools: ['ud_get_domain'] };
    assert.throws(() => build({ ...review, positiveTests: [hidden, ...review.positiveTests.slice(1)] }), (error) => /ud_get_domain is not a hosted tool/u.test(String(error.stderr)));
    assert.throws(() => build({ ...review, placeholder: true }), (error) => /placeholder texts/u.test(String(error.stderr)));
    build({ ...review, placeholder: true }, ['--allow-placeholder']);
    // A recorded demo and an explicit country list reach the zip.
    build({ ...review, demoRecordingURL: 'https://example.com/demo', countries: [] });
    const openai = JSON.parse(unzipEntry(readFileSync(join(out, 'chatgpt-plugin.zip')), 'plugin.json').toString('utf8')).extensions['com.openai'];
    assert.equal(openai.review.demo_recording_url, 'https://example.com/demo');
    assert.deepEqual(openai.publication.countries, []);
});
