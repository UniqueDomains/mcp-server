/*----------------------------------
- THE PLUGIN BUNDLE: CLAUDE CODE, GROK BUILD, GEMINI CLI, CURSOR AND DEVIN
----------------------------------*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOOLS } from '../dist/index.js';
import { FIXED_CUT_OPERATIONS, FORBIDDEN_WORDS, PLAN_WORDS, bundlePlanTalkIn } from '../scripts/lib/tools.mjs';
import { DEVIN_PLUGIN_KEYS, HOSTED_MCP_URL } from '../scripts/lib/plugin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROOT, 'plugin');
const MCP_URL = HOSTED_MCP_URL;
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const pkg = read('package.json');

/**
 * The listing texts, v2 in the sales voice (`docs/plans/2026-11-11-listing-texts-v2.md` in the platform repository,
 * Fable 5.2, Gaetan's decision 4 of 2026-11-11: they ship with 0.1.5): section E's lines for each manifest.
 */
const ONE_LINER = 'Ask if a domain name is taken, what nine registrars charge for it and what similar names sold for. 51 read-only tools over a daily record of 37 million names. No account, no key, no sign-in.';
const GEMINI_LINE = 'Domain status, WHOIS records, nine registrars\' daily prices, renewal traps and auctions. No key.';
const MARKETPLACE_LINE = 'One plugin from Unique Domains: 51 read-only tools over a daily record of 37 million domain names, and a skill that tells your assistant which tool answers which question.';
const GROK_LINE = 'Ask if a domain name is taken, what nine registrars charge for it and what similar names sold for. 51 read-only tools over a daily record of 37 million names. Hosted: nothing to install, no sign-in, no key.';
const DEVIN_SHORT_LINE = 'Is that name taken? What does it cost?';
const DEVIN_LINE = 'Check if a domain name is taken, compare nine registrars\' prices and spot renewal traps, from a daily record of 37 million names';

const claude = read('plugin/.claude-plugin/plugin.json');
const grok = read('plugin/.grok-plugin/plugin.json');
const gemini = read('gemini-extension.json');
const cursor = read('.cursor-plugin/plugin.json');
const marketplace = read('.claude-plugin/marketplace.json');

/** Builds the Devin folder once, into a temporary directory, inside the first test that needs it (so a broken script fails tests, not the file). */
let devinBuild = null;
const buildDevin = () => {
    if (devinBuild) return devinBuild;
    const out = mkdtempSync(join(tmpdir(), 'ud-devin-'));
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'devin-plugin.mjs'), '--out', out], { cwd: ROOT, stdio: 'pipe' });
    const dir = join(out, 'plugins', 'unique-domains');
    devinBuild = { dir, manifest: JSON.parse(readFileSync(join(dir, '.devin-plugin', 'plugin.json'), 'utf8')) };
    return devinBuild;
};

/** The plugin folder's files as git sees them (tracked, or new and not ignored): what Anthropic's portal reads from the repository. */
const gitFilesOf = (dir) =>
    execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', relative(ROOT, dir)], { cwd: ROOT, encoding: 'utf8' })
        .split('\n')
        .filter(Boolean)
        .map((path) => relative(relative(ROOT, dir), path).split('\\').join('/'))
        .sort();

/** Every file under a folder, as paths relative to it. */
const filesOf = (dir) =>
    readdirSync(dir, { recursive: true })
        .map((entry) => join(dir, entry))
        .filter((path) => statSync(path).isFile())
        .map((path) => relative(dir, path).split('\\').join('/'))
        .sort();

const SKILL = readFileSync(join(PLUGIN, 'skills', 'unique-domains', 'SKILL.md'), 'utf8');

/**
 * No plan, price, key, score or ranking talk in one text of the bundle; a failure names the words it met. `figures`
 * lets the record's dollar figures through (Gaetan's "A" of 2026-11-12: the plugin README and the OpenAI sheet's
 * longDescription only).
 */
const assertCleanText = (text, where, options) => {
    assert.deepEqual(bundlePlanTalkIn(text, options), [], `${where}: plan, price or key talk`);
    assert.equal(PLAN_WORDS.test(text), false, `${where}: ${text.match(PLAN_WORDS)?.[0]}`);
    for (const word of FORBIDDEN_WORDS) assert.equal(word.test(text), false, `${where}: ${text.match(word)?.[0]}`);
};

test('the five manifests agree on the name, the version, the repository and the licence, and carry the listing texts', () => {
    const devin = buildDevin().manifest;
    for (const manifest of [claude, grok, gemini, cursor, devin]) assert.equal(manifest.name, 'unique-domains');
    for (const manifest of [claude, grok, gemini, cursor]) assert.equal(manifest.version, pkg.version);
    for (const manifest of [claude, grok, cursor, devin]) assert.equal(manifest.repository, 'https://github.com/UniqueDomains/mcp-server');
    for (const manifest of [claude, grok, cursor]) assert.equal(manifest.license, 'MIT');
    for (const manifest of [claude, grok, devin]) assert.equal(manifest.homepage, 'https://unique.domains/api/mcp');
    assert.deepEqual(claude.author, grok.author);
    assert.equal(claude.displayName, 'Unique Domains');
    assert.equal(devin.displayName, 'Unique Domains');

    assert.equal(claude.description, ONE_LINER);
    assert.equal(grok.description, GROK_LINE);
    assert.equal(marketplace.plugins[0].description, ONE_LINER);
    assert.ok(ONE_LINER.length <= 200);
    assert.equal(gemini.description, GEMINI_LINE);
    assert.ok(GEMINI_LINE.length <= 100);
    assert.equal(devin.description, DEVIN_LINE);
    assert.equal(devin.shortDescription, DEVIN_SHORT_LINE);
    // Cursor keeps its own line and homepage (plan section 4.6: only the skill's path is added there).
    assert.equal(cursor.description, 'Domain names, words, TLDs, registrar prices, the domain market, trends and the agenda, from the Unique Domains API.');
    assert.equal(cursor.homepage, 'https://unique.domains/api');

    // Anthropic's directory reads these from plugin.json only; the icon is a file inside the plugin.
    for (const key of ['documentationUrl', 'supportUrl', 'privacyPolicyUrl', 'termsOfServiceUrl']) assert.match(claude[key], /^https:\/\//u, key);
    assert.equal(claude.icon, './logo.png');
    assert.match(claude.name, /^[a-z0-9-]{1,64}$/u);
    assert.ok(!['claude', 'anthropic', 'official', 'plugin', 'mcp', 'test'].includes(claude.name));
    // Grok's keywords and domains are scoped to the brand (its contributing guide).
    assert.deepEqual(grok.keywords, ['unique domains', 'uniquedomains', 'unique.domains']);
    assert.equal(grok.logo, 'logo.png');
});

test('every server entry of the bundle is the hosted connector, with no command, key or header', () => {
    const devin = buildDevin().manifest;
    const entries = [
        [read('plugin/.mcp.json').mcpServers, { type: 'http', url: MCP_URL }],
        [gemini.mcpServers, { httpUrl: MCP_URL }],
        [devin.mcpServers, { url: MCP_URL }],
        [read('mcp.json').mcpServers, { url: MCP_URL }],
    ];
    for (const [servers, expected] of entries) {
        assert.deepEqual(Object.keys(servers), ['uniquedomains']);
        assert.deepEqual(servers.uniquedomains, expected);
        for (const key of ['command', 'args', 'env', 'headers', 'trust']) assert.equal(key in servers.uniquedomains, false, key);
    }
    // Only Gemini and Devin declare the server inside their manifest; Claude Code and Grok read `.mcp.json`.
    for (const manifest of [claude, grok, cursor]) assert.equal('mcpServers' in manifest, false);
});

// Gaetan's 3A of 2026-11-11: Gemini gets the guidance Claude's plugin skill gives, from a context file at the root,
// the skill's body word for word (its front matter is Claude's own), so one edit of the skill reaches both.
test('the Gemini context file is the plugin skill without its front matter', () => {
    assert.equal(gemini.contextFileName, 'GEMINI.md');
    const skill = readFileSync(join(ROOT, 'plugin', 'skills', 'unique-domains', 'SKILL.md'), 'utf8');
    assert.equal(readFileSync(join(ROOT, 'GEMINI.md'), 'utf8'), skill.split('---\n', 3)[2].replace(/^\n+/u, ''));
});

test('the skill names every hosted tool and no other, and holds no plan, price, score or ranking word', () => {
    const frontmatter = SKILL.match(/^---\n([\s\S]*?)\n---\n/u);
    assert.ok(frontmatter, 'a frontmatter block');
    const lines = frontmatter[1].split('\n');
    assert.equal(lines[0], 'name: unique-domains');
    assert.equal(lines.length, 2);
    assert.match(lines[1], /^description: \S/u);
    assert.equal(lines[1].slice('description: '.length).includes(': '), false, 'no ": " inside the description (YAML)');

    const named = new Set(SKILL.match(/\bud_[a-z_]+/gu));
    const hosted = new Set(TOOLS.filter((tool) => tool.hosted).map((tool) => tool.name));
    assert.deepEqual([...named].filter((name) => !hosted.has(name)).sort(), [], 'names a tool the hosted connector does not list');
    assert.deepEqual([...hosted].filter((name) => !named.has(name)).sort(), [], 'misses a hosted tool');

    assertCleanText(SKILL, 'SKILL.md');
    assert.equal(SKILL.includes('\u2014'), false);

    // Review B1: a fixed cut is not the whole list, and the skill says which tools answer one.
    const cut = SKILL.split('\n').find((line) => line.startsWith('- No next page does not always mean the whole list.'));
    assert.ok(cut, 'the bullet on fixed cuts');
    for (const operation of FIXED_CUT_OPERATIONS) assert.ok(cut.includes(`\`ud_${operation}\``), `the cut bullet names ud_${operation}`);
});

test('the plan, price and key guard refuses a plan pitch and lets ordinary words through', () => {
    const pitch = 'Founder members read more: from $19 a month, with a key (set UD_API_KEY). Investor members get every tool.';
    const met = bundlePlanTalkIn(pitch);
    for (const label of ['a price', 'a price per month', 'a key or its variable', 'a key', 'membership', 'a plan name']) assert.ok(met.some((entry) => entry.startsWith(`${label} (`)), `${label} in ${met.join(', ')}`);
    assert.deepEqual(bundlePlanTalkIn('The registry published its launch plans, and registrar pricing follows.'), []);
    assert.deepEqual(bundlePlanTalkIn('Pass `founder` or `investor`. The industry events of a month. Once a month, older lines are deleted.'), []);
    for (const text of ['Upgrade now', 'Subscribers read more', 'the paid grade', 'set ud_live_123', 'your API key', 'Choose a plan', '19 USD per month', 'See our pricing']) assert.notDeepEqual(bundlePlanTalkIn(text), [], text);
});

test('the two texts that carry the record\'s figures still refuse plan and price words (Gaetan\'s "A" of 2026-11-12)', () => {
    const readme = readFileSync(join(PLUGIN, 'README.md'), 'utf8');
    const { longDescription } = read('directories/openai/review.json');
    for (const [where, text] of [['plugin/README.md', readme], ['review.json longDescription', longDescription]]) {
        assert.ok(/\$\d/u.test(text), `${where} carries a figure`);
        assert.deepEqual(bundlePlanTalkIn(text, { figures: true }), [], where);
        for (const words of ['Choose a plan.', 'The Founder plan.', 'Investor members read more.', 'Billed per month.', 'See our pricing.']) {
            assert.notDeepEqual(bundlePlanTalkIn(`${text}\n\n${words}`, { figures: true }), [], `${where} + "${words}"`);
        }
        assert.notDeepEqual(bundlePlanTalkIn(text), [], `${where}: the amount entries still read its figures`);
    }
    // The figures pass only there: any other text still refuses an amount.
    assert.notDeepEqual(bundlePlanTalkIn('From $19 a month.'), []);
});

test('the plugin folder holds the files of the plan and meets Anthropic\'s limits', () => {
    const files = gitFilesOf(PLUGIN);
    assert.deepEqual(files, [
        '.claude-plugin/plugin.json',
        '.grok-plugin/plugin.json',
        '.mcp.json',
        'LICENSE',
        'README.md',
        'logo.png',
        'skills/unique-domains/SKILL.md',
    ]);
    for (const file of files) {
        const size = statSync(join(PLUGIN, file)).size;
        // Anthropic's checklist of 2026-11-11: every file under 5 MiB, every file that is not an image or a font under 256 KiB.
        assert.ok(size < 5 * 1024 * 1024, file);
        if (!/\.(png|jpe?g|webp|svg|gif|woff2?|ttf|otf)$/iu.test(file)) assert.ok(size < 256 * 1024, file);
    }
    assert.equal(readFileSync(join(PLUGIN, 'LICENSE'), 'utf8'), readFileSync(join(ROOT, 'LICENSE'), 'utf8'));
    assert.deepEqual(readFileSync(join(PLUGIN, 'logo.png')), readFileSync(join(ROOT, 'assets', 'logo.png')));

    const readme = readFileSync(join(PLUGIN, 'README.md'), 'utf8');
    assert.ok(readme.split(/\s+/u).filter(Boolean).length >= 40);
    assert.ok(readme.includes('https://mcp.unique.domains/mcp') && readme.includes('https://api.unique.domains'));
    assertCleanText(readme, 'plugin/README.md', { figures: true });
});

test('the marketplace file lists the one plugin of ./plugin', () => {
    assert.equal(marketplace.name, 'uniquedomains');
    assert.equal(marketplace.description, MARKETPLACE_LINE);
    const devin = buildDevin().manifest;
    const texts = { 'marketplace description': marketplace.description, 'marketplace entry': marketplace.plugins[0].description, claude: claude.description, grok: grok.description, gemini: gemini.description, cursor: cursor.description, devin: devin.description, 'devin short': devin.shortDescription };
    for (const [where, text] of Object.entries(texts)) assertCleanText(text, where);
    // The OpenAI sheet ships the same skill and is a listing text too (decision 4).
    const sheet = read('directories/openai/review.json');
    for (const key of ['displayName', 'shortDescription', 'description', 'longDescription', 'releaseNotes', 'commerceDescription']) assertCleanText(sheet[key], `review.json ${key}`, key === 'longDescription' ? { figures: true } : undefined);
    for (const test of [...sheet.positiveTests, ...sheet.negativeTests]) assertCleanText([test.description, test.prompt, test.expected, test.reason ?? ''].join(' '), `review.json "${test.description}"`);
    assert.equal(marketplace.owner.name, 'Unique Domains');
    assert.equal(marketplace.plugins.length, 1);
    assert.equal(marketplace.plugins[0].name, claude.name);
    assert.equal(marketplace.plugins[0].source, './plugin');
});

test('the Devin folder follows Devin\'s validator and copies the skill byte for byte', () => {
    const { dir: devinDir, manifest: devin } = buildDevin();
    assert.deepEqual(Object.keys(devin).filter((key) => !DEVIN_PLUGIN_KEYS.includes(key)), []);
    assert.equal(devin.name, basename(devinDir));
    assert.ok(devin.shortDescription.length > 0 && devin.shortDescription.length <= 40);
    assert.ok(devin.description.length >= 60 && devin.description.length <= 130);
    assert.equal(devin.description.endsWith('.'), false);
    assert.equal(/integration|mcp server/iu.test(devin.description), false);
    assert.deepEqual(devin.keywords, ['Development Tools', 'Productivity']);
    assert.deepEqual(filesOf(devinDir), ['.devin-plugin/plugin.json', 'logo.png', 'skills/unique-domains/SKILL.md']);
    assert.deepEqual(readFileSync(join(devinDir, 'skills', 'unique-domains', 'SKILL.md')), Buffer.from(SKILL));
    const logo = readFileSync(join(devinDir, devin.logo));
    assert.equal(logo.readUInt32BE(16), 256);
    assert.equal(logo.readUInt32BE(20), 256);
});
