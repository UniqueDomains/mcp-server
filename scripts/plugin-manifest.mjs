#!/usr/bin/env node
/*----------------------------------
- THE CHATGPT PLUGIN PACKAGE
----------------------------------*/

/**
 * Builds `dist/chatgpt-plugin.zip`, the package uploaded at platform.openai.com/plugins (plan section 2, channel 6),
 * and `dist/chatgpt-plugin-review.json`, the sheet of what the submission form asks beside the zip.
 *
 * The layout follows OpenAI's plugin pages as re-read on 2026-11-09 (`plugins/build/plugins`,
 * `plugins/deploy/submission-errors`), which replaced the `manifest.json` the plan named:
 *
 *   plugin.json                       the portable manifest, OpenAI's fields under `extensions["com.openai"].interface`
 *   mcp.json                          the hosted server with `auth: { type: "none" }`
 *   skills/unique-domains/SKILL.md    a public zip needs at least one valid skill
 *   assets/logo.png, assets/composer-icon.png
 *
 * The test cases, the demo recording's address, the commerce declaration and the release notes go in the zip too, under
 * `extensions["com.openai"].review` and `.publication`, the keys OpenAI's submission page documents and the portal
 * imports (`plugins/deploy/submission`, re-read on 2026-11-10; fix round A8). The annotation justifications have no
 * documented key, so they stay in the review sheet with a copy of the rest. The texts come from `plugin/review.json`,
 * copied from the channels kit; every limit OpenAI states is checked here and fails the build.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const MCP_URL = 'https://mcp.unique.domains/mcp';

// `--review <file>` reads another sheet (the tests check that a limit breaks the build); `--out <dir>` writes elsewhere.
const argument = (name) => {
    const index = process.argv.indexOf(name);
    return index === -1 ? null : process.argv[index + 1];
};
const review = JSON.parse(await readFile(argument('--review') ?? join(ROOT, 'plugin', 'review.json'), 'utf8'));
const DIST = argument('--out') ?? join(ROOT, 'dist');
const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
const { TOOLS } = await import(join(ROOT, 'dist', 'index.js'));

/* ---------- Checks (OpenAI's final submission limits) ---------- */

/**
 * The categories `interface.category` accepts, as OpenAI's error reference lists them under `plugin_category_unknown`
 * (https://developers.openai.com/plugins/deploy/submission-errors, re-read on 2026-11-10). A category outside the list
 * fails the upload.
 */
const OPENAI_CATEGORIES = [
    'Productivity',
    'Creativity',
    'Developer Tools',
    'Business & Operations',
    'Data & Analytics',
    'Communication',
    'Education & Research',
    'Security',
    'Finance',
    'Healthcare',
    'Travel',
    'Entertainment',
    'Other',
];

const problems = [];
const check = (condition, message) => {
    if (!condition) problems.push(message);
};
const oneLine = (value) => typeof value === 'string' && value.trim() !== '' && !/[\r\n]/u.test(value);
const https = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.username === '' && value.length <= 1024;
    } catch {
        return false;
    }
};

/** WCAG relative luminance of `#rrggbb`. */
const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
};

/** Width and height of a PNG, from its IHDR chunk. */
const pngSize = (buffer) => {
    const signature = buffer.subarray(0, 8).toString('hex');
    if (signature !== '89504e470d0a1a0a' || buffer.toString('latin1', 12, 16) !== 'IHDR') return null;
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

check(/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/u.test(review.name), 'name: 64 characters at most, an ASCII letter or digit first, then letters, digits, _ and -');
check(oneLine(review.displayName) && review.displayName.length <= 30, 'displayName: one line, 30 characters at most');
check(oneLine(review.shortDescription) && review.shortDescription.length <= 30, 'shortDescription: one line, 30 characters at most');
check(typeof review.longDescription === 'string' && review.longDescription.trim() !== '' && review.longDescription.length <= 4000, 'longDescription: 4,000 characters at most');
check(oneLine(review.developerName) && review.developerName.length <= 80, 'developerName: one line, 80 characters at most');
check(OPENAI_CATEGORIES.includes(review.category), `category: one of ${OPENAI_CATEGORIES.join(', ')}`);
check(typeof review.description === 'string' && review.description.length <= 1024, 'description: 1,024 characters at most');
check(Array.isArray(review.capabilities) && review.capabilities.length <= 20 && review.capabilities.every((item) => oneLine(item) && item.length <= 120), 'capabilities: 20 at most, one line of 120 characters each');
const prompts = review.defaultPrompt ?? [];
check(Array.isArray(prompts) && prompts.length >= 1 && prompts.length <= 3, 'defaultPrompt: one to three starter prompts');
check(prompts.every((prompt) => oneLine(prompt) && prompt.length <= 128 && !prompt.includes('@')), 'defaultPrompt: one line of 128 characters each, no @mention');
check(new Set(prompts.map((prompt) => prompt.normalize('NFKC').replace(/\s+/gu, ' ').trim().toLowerCase())).size === prompts.length, 'defaultPrompt: unique');
for (const key of ['websiteURL', 'privacyPolicyURL', 'termsOfServiceURL', 'supportURL']) check(https(review[key]), `${key}: an HTTPS URL of 1,024 characters at most`);
check(/^#[0-9a-fA-F]{6}$/u.test(review.brandColor) && contrast(review.brandColor, '#ffffff') >= 2, 'brandColor: #rrggbb with 2:1 contrast against white');
check(/^#[0-9a-fA-F]{6}$/u.test(review.brandColorDark) && contrast(review.brandColorDark, '#212121') >= 2, 'brandColorDark: #rrggbb with 2:1 contrast against #212121');
check(Array.isArray(review.positiveTests) && review.positiveTests.length === 5, 'positiveTests: exactly five');
check(Array.isArray(review.negativeTests) && review.negativeTests.length === 3, 'negativeTests: exactly three');
for (const test of [...(review.positiveTests ?? []), ...(review.negativeTests ?? [])]) {
    check(oneLine(test.description) && test.description.length <= 4000, 'test cases: a description of one line, 4,000 characters at most');
    check(oneLine(test.prompt) && oneLine(test.expected), 'test cases: a prompt and an expected answer, one line each');
}
const hostedNames = new Set(TOOLS.filter((tool) => tool.hosted).map((tool) => tool.name));
for (const test of review.positiveTests ?? []) {
    check(Array.isArray(test.tools) && test.tools.length > 0, `positive test "${test.description}": the tools it triggers`);
    for (const name of test.tools ?? []) check(hostedNames.has(name), `positive test "${test.description}": ${name} is not a hosted tool`);
}
for (const test of review.negativeTests ?? []) check(oneLine(test.reason), `negative test "${test.description}": why the plugin should not act`);
// A tool named in an expected answer must be one the hosted connector lists (`ud_get_domain` left it in 0.1.3).
for (const test of [...(review.positiveTests ?? []), ...(review.negativeTests ?? [])]) {
    for (const name of `${test.expected} ${test.reason ?? ''}`.match(/\bud_[a-z_]+/gu) ?? []) check(hostedNames.has(name), `test "${test.description}": names ${name}, not a hosted tool`);
}
check(typeof review.releaseNotes === 'string' && review.releaseNotes.trim() !== '', 'releaseNotes: required');
check(review.commerce === false, 'commerce: false (no payment or purchase anywhere)');
check(oneLine(review.commerceDescription), 'commerceDescription: one line on why there is no commerce');
check(review.demoRecordingURL === undefined || review.demoRecordingURL === '' || https(review.demoRecordingURL), 'demoRecordingURL: an HTTPS URL, or empty until it is recorded');
check(review.countries === undefined || (Array.isArray(review.countries) && review.countries.every((code) => /^[A-Z]{2}$/u.test(code))), 'countries: left out, or a list of uppercase country codes ([] removes every restriction)');
check(/^\d+\.\d+\.\d+$/u.test(pkg.version), 'version: a semantic version');

const icons = {};
for (const [key, file] of [['logo', 'logo.png'], ['composerIcon', 'composer-icon.png']]) {
    const buffer = await readFile(join(ROOT, 'assets', file));
    const size = pngSize(buffer);
    check(size !== null && size.width === size.height && size.width >= 48 && size.width <= 4096, `${key}: a square PNG of 48 to 4,096 px`);
    check(buffer.length <= 5 * 1024 * 1024, `${key}: 5 MiB at most`);
    icons[key] = { path: `assets/${file}`, buffer };
}
const hostedTools = TOOLS.filter((tool) => tool.hosted);
check(hostedTools.length === 51, `the hosted profile has ${hostedTools.length} tools, 51 expected`);
for (const tool of hostedTools) {
    for (const hint of ['readOnlyHint', 'openWorldHint', 'destructiveHint']) check(typeof tool.annotations[hint] === 'boolean', `${tool.name}: ${hint} explicit`);
    for (const reason of ['readOnly', 'openWorld', 'destructive']) check(oneLine(tool.justification[reason]), `${tool.name}: a ${reason} justification`);
}

// Placeholder texts never reach a zip meant for upload: CI builds with --allow-placeholder (review finding 11).
check(!review.placeholder || process.argv.includes('--allow-placeholder'), 'plugin/review.json holds placeholder texts: fill them from the channels kit and set "placeholder" to false (or pass --allow-placeholder for a test build)');

if (problems.length > 0) {
    console.error(`The plugin package does not meet OpenAI's limits:\n- ${problems.join('\n- ')}`);
    process.exit(1);
}

/* ---------- The files ---------- */

const plugin = {
    $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
    name: review.name,
    version: pkg.version,
    description: review.description,
    author: { name: review.developerName, url: 'https://unique.domains' },
    homepage: pkg.homepage,
    repository: 'https://github.com/UniqueDomains/mcp-server',
    license: pkg.license,
    extensions: {
        'com.openai': {
            interface: {
                displayName: review.displayName,
                shortDescription: review.shortDescription,
                longDescription: review.longDescription,
                developerName: review.developerName,
                category: review.category,
                capabilities: review.capabilities,
                websiteURL: review.websiteURL,
                privacyPolicyURL: review.privacyPolicyURL,
                termsOfServiceURL: review.termsOfServiceURL,
                supportURL: review.supportURL,
                defaultPrompt: prompts,
                brandColor: review.brandColor,
                brandColorDark: review.brandColorDark,
                composerIcon: `./${icons.composerIcon.path}`,
                logo: `./${icons.logo.path}`,
            },
            // OpenAI's import keys (fix round A8): imported test cases are read-only in the dashboard, so each negative
            // case carries its reason and its expected refusal in `expected_behavior`, which the field reference allows
            // on both lists.
            review: {
                test_cases: {
                    positive: review.positiveTests.map((test) => ({ description: test.description, prompt: test.prompt, tools_triggered: test.tools.join(', '), expected_behavior: test.expected })),
                    negative: review.negativeTests.map((test) => ({ description: test.description, prompt: test.prompt, expected_behavior: `${test.reason} ${test.expected}` })),
                },
                ...(review.demoRecordingURL ? { demo_recording_url: review.demoRecordingURL } : {}),
                commerce: false,
                commerce_description: review.commerceDescription,
            },
            publication: {
                release_notes: review.releaseNotes,
                // Left out unless the sheet sets it: omitting the key keeps the targeting chosen in Review details (AF-C3).
                ...(review.countries !== undefined ? { countries: review.countries } : {}),
            },
        },
    },
};
const mcp = {
    $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
    mcpServers: { uniquedomains: { type: 'streamable-http', url: MCP_URL, extensions: { 'com.openai': { auth: { type: 'none' } } } } },
};
const skill = await readFile(join(ROOT, 'plugin', 'skills', 'unique-domains', 'SKILL.md'));

/* ---------- A minimal zip writer (deflate, no dependency) ---------- */

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});
const crc32 = (buffer) => {
    let crc = 0xffffffff;
    for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
};

/** A fixed timestamp (2026-01-01 00:00) so the same inputs give the same bytes. */
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

const zip = (entries) => {
    const locals = [];
    const centrals = [];
    let offset = 0;
    for (const { path, data } of entries) {
        const name = Buffer.from(path, 'utf8');
        const compressed = deflateRawSync(data, { level: 9 });
        const crc = crc32(data);
        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0x0800, 6); // UTF-8 names
        local.writeUInt16LE(8, 8); // deflate
        local.writeUInt16LE(DOS_TIME, 10);
        local.writeUInt16LE(DOS_DATE, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(compressed.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(name.length, 26);
        locals.push(local, name, compressed);
        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(8, 10);
        central.writeUInt16LE(DOS_TIME, 12);
        central.writeUInt16LE(DOS_DATE, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(compressed.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(name.length, 28);
        central.writeUInt32LE(offset, 42);
        centrals.push(central, name);
        offset += local.length + name.length + compressed.length;
    }
    const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(entries.length, 8);
    end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralSize, 12);
    end.writeUInt32LE(offset, 16);
    return Buffer.concat([...locals, ...centrals, end]);
};

const json = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
await mkdir(DIST, { recursive: true });
await writeFile(
    join(DIST, 'chatgpt-plugin.zip'),
    zip([
        { path: 'plugin.json', data: json(plugin) },
        { path: 'mcp.json', data: json(mcp) },
        { path: 'skills/unique-domains/SKILL.md', data: skill },
        { path: icons.logo.path, data: icons.logo.buffer },
        { path: icons.composerIcon.path, data: icons.composerIcon.buffer },
    ]),
);
await writeFile(
    join(DIST, 'chatgpt-plugin-review.json'),
    json({
        mcpServerUrl: MCP_URL,
        domainVerification: 'Serve the portal token at https://mcp.unique.domains/.well-known/openai-apps-challenge through UD_WELLKNOWN_FILES.',
        positiveTests: review.positiveTests,
        negativeTests: review.negativeTests,
        releaseNotes: review.releaseNotes,
        demoRecordingURL: review.demoRecordingURL || null,
        commerce: false,
        tools: hostedTools.map((tool) => ({ name: tool.name, annotations: tool.annotations, justification: tool.justification })),
    }),
);
console.log(`dist/chatgpt-plugin.zip and dist/chatgpt-plugin-review.json written (${hostedTools.length} tools).`);
if (!review.demoRecordingURL) console.warn('No demo recording yet: OpenAI requires one for the review. Set demoRecordingURL in plugin/review.json once Gaetan has recorded it.');
if (review.placeholder) console.log('Test build: plugin/review.json still holds placeholder texts; the channels kit fills them before the submission.');
