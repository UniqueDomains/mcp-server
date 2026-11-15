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
    // The skill's path (code repos plan, review item C-D3): it replaces Cursor's own `skills/` scan, so it must hold the skill.
    assert.equal(cursor.skills, './plugin/skills/');
    assert.ok(readFileSync(join(ROOT, cursor.skills, 'unique-domains', 'SKILL.md'), 'utf8').startsWith('---\nname: unique-domains\n'));
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
    assert.ok(openai.publication.release_notes.includes('51 tools over a daily record'));
    // No demo recording yet, and no country list: both keys stay out, so the portal keeps its own values.
    assert.equal('demo_recording_url' in openai.review, false);
    assert.equal('countries' in openai.publication, false);
    assert.equal(read('directories/openai/review.json').placeholder, false);
});

test('a field over its limit, an unknown category or a hidden tool fails the build; a placeholder sheet needs the flag', () => {
    const out = mkdtempSync(join(tmpdir(), 'ud-plugin-'));
    const review = read('directories/openai/review.json');
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
    // The starter prompts' side path (plan `connector-trigger-rate-2026-11-14`, review m2): too long, an @mention, a repeat.
    const prompts = review.defaultPrompt;
    const cases = [
        ['x'.repeat(129), /defaultPrompt: one line of 128 characters each/u],
        ['Ask @unique about get.plumbing', /defaultPrompt: one line of 128 characters each/u],
        [prompts[0].toUpperCase(), /defaultPrompt: unique/u],
    ];
    for (const [last, message] of cases) {
        assert.throws(() => build({ ...review, defaultPrompt: [prompts[0], prompts[1], last] }), (error) => message.test(String(error.stderr)), last);
    }
    build({ ...review, placeholder: true }, ['--allow-placeholder']);
    // A recorded demo and an explicit country list reach the zip.
    build({ ...review, demoRecordingURL: 'https://example.com/demo', countries: [] });
    const openai = JSON.parse(unzipEntry(readFileSync(join(out, 'chatgpt-plugin.zip')), 'plugin.json').toString('utf8')).extensions['com.openai'];
    assert.equal(openai.review.demo_recording_url, 'https://example.com/demo');
    assert.deepEqual(openai.publication.countries, []);
});

// Plan `connector-trigger-rate-2026-11-14` (0.1.7): the starter prompts Gaetan chose (G3 = A), a founder's, an
// investor's and one for both; the manifest builder already refuses one over 128 characters, with an @ or repeated.
test('the ChatGPT starter prompts are the three decided lines, each one line under 128 characters with no @', () => {
    const prompts = read('directories/openai/review.json').defaultPrompt;
    assert.deepEqual(prompts, [
        'I am naming a skincare brand. Is organic.com taken, and which endings is organic still available on?',
        'Is get.plumbing for sale, and what did similar names sell for?',
        'Which endings are cheap the first year and cost much more to renew?',
    ]);
    for (const prompt of prompts) assert.ok(prompt.length <= 128 && !prompt.includes('@') && !prompt.includes('\n'), prompt);
});

// The golden set (decision S14 of that plan): the prompts the before and after runs replay in Claude and ChatGPT.
test('the golden prompt set: 32 prompts, unique, each tool a free hosted tool, no prompt naming the connector', async () => {
    const { TOOLS } = await import('../dist/index.js');
    const hosted = new Set(TOOLS.filter((tool) => tool.hosted && tool.tier === 'free').map((tool) => tool.name));
    const { prompts } = read('directories/golden-prompts.json');
    assert.equal(prompts.length, 32);
    assert.equal(new Set(prompts.map((entry) => entry.id)).size, 32);
    assert.equal(new Set(prompts.map((entry) => entry.prompt.toLowerCase())).size, 32);
    const kinds = { D: 'direct', F: 'founder', I: 'investor', N: 'negative' };
    for (const entry of prompts) {
        assert.deepEqual(Object.keys(entry), ['id', 'kind', 'prompt', 'tools', 'note'], entry.id);
        assert.match(entry.id, /^[DFIN]\d$/u);
        assert.equal(entry.kind, kinds[entry.id[0]], entry.id);
        assert.ok(entry.note.length > 0, entry.id);
        // A negative expects no call (N1 and N2 allow a read call, which their note says); every other prompt names its right tools.
        assert.equal(entry.tools.length === 0, entry.kind === 'negative', entry.id);
        for (const name of entry.tools) assert.ok(hosted.has(name), `${entry.id}: ${name} is not a free hosted tool`);
        // No mention of the connector: the set measures the calls an assistant makes unasked. A social handle's @ (N6) is
        // not one.
        assert.doesNotMatch(entry.prompt, /unique[\s._-]*domains|@\s*unique|\bud_/iu, entry.id);
    }
    assert.deepEqual(prompts.map((entry) => entry.kind).reduce((counts, kind) => ({ ...counts, [kind]: (counts[kind] ?? 0) + 1 }), {}), { direct: 7, founder: 9, investor: 8, negative: 8 });
});
