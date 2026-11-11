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
import { FORBIDDEN_WORDS, PLAN_WORDS } from '../scripts/lib/tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = join(ROOT, 'plugin');
const MCP_URL = 'https://mcp.unique.domains/mcp';
const read = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));
const pkg = read('package.json');

/** The three listing texts of the plan's section 6, each with its store's limit. */
const ONE_LINER = 'Look up domain names, TLDs, registrar prices, the domain market, naming trends and industry events from the data Unique Domains collects and stores itself.';
const GEMINI_LINE = 'Domain names, TLDs, registrar prices, the domain market, trends and the agenda, from stored data.';
const DEVIN_LINE = 'Check domain names, registry records, TLD facts, registrar prices, domain sales and auctions with Unique Domains';

const claude = read('plugin/.claude-plugin/plugin.json');
const grok = read('plugin/.grok-plugin/plugin.json');
const gemini = read('gemini-extension.json');
const cursor = read('.cursor-plugin/plugin.json');
const marketplace = read('.claude-plugin/marketplace.json');

/** Builds the Devin folder into a temporary directory and returns its path. */
const buildDevin = () => {
    const out = mkdtempSync(join(tmpdir(), 'ud-devin-'));
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'devin-plugin.mjs'), '--out', out], { cwd: ROOT, stdio: 'pipe' });
    return join(out, 'plugins', 'unique-domains');
};
const devinDir = buildDevin();
const devin = JSON.parse(readFileSync(join(devinDir, '.devin-plugin', 'plugin.json'), 'utf8'));

/** Every file under a folder, as paths relative to it. */
const filesOf = (dir) =>
    readdirSync(dir, { recursive: true })
        .map((entry) => join(dir, entry))
        .filter((path) => statSync(path).isFile())
        .map((path) => relative(dir, path).split('\\').join('/'))
        .sort();

const SKILL = readFileSync(join(PLUGIN, 'skills', 'unique-domains', 'SKILL.md'), 'utf8');

test('the five manifests agree on the name, the version, the repository and the licence, and carry the texts of section 6', () => {
    for (const manifest of [claude, grok, gemini, cursor, devin]) assert.equal(manifest.name, 'unique-domains');
    for (const manifest of [claude, grok, gemini, cursor]) assert.equal(manifest.version, pkg.version);
    for (const manifest of [claude, grok, cursor, devin]) assert.equal(manifest.repository, 'https://github.com/UniqueDomains/mcp-server');
    for (const manifest of [claude, grok, cursor]) assert.equal(manifest.license, 'MIT');
    for (const manifest of [claude, grok, devin]) assert.equal(manifest.homepage, 'https://unique.domains/api/mcp');
    assert.deepEqual(claude.author, grok.author);
    assert.equal(claude.displayName, 'Unique Domains');
    assert.equal(devin.displayName, 'Unique Domains');

    assert.equal(claude.description, ONE_LINER);
    assert.equal(grok.description, ONE_LINER);
    assert.equal(marketplace.plugins[0].description, ONE_LINER);
    assert.equal(ONE_LINER.length, 155);
    assert.equal(gemini.description, GEMINI_LINE);
    assert.ok(GEMINI_LINE.length <= 100);
    assert.equal(devin.description, DEVIN_LINE);
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
    assert.equal('contextFileName' in gemini, false);
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

    for (const word of FORBIDDEN_WORDS) assert.equal(word.test(SKILL), false, String(word));
    assert.equal(PLAN_WORDS.test(SKILL), false);
    assert.equal(/\b(?:plan|plans|upgrade|pricing|member key|api key|founder plan|investor plan)\b/iu.test(SKILL.replace(/`(?:founder|investor)`/gu, '')), false);
    assert.equal(SKILL.includes('\u2014'), false);
});

test('the plugin folder holds the files of the plan and meets Anthropic\'s limits', () => {
    const files = filesOf(PLUGIN);
    assert.deepEqual(files, [
        '.claude-plugin/plugin.json',
        '.grok-plugin/plugin.json',
        '.mcp.json',
        'LICENSE',
        'README.md',
        'logo.png',
        'skills/unique-domains/SKILL.md',
    ]);
    assert.ok(files.length < 512);
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
    assert.equal(PLAN_WORDS.test(readme), false);
    for (const word of FORBIDDEN_WORDS) assert.equal(word.test(readme), false, String(word));
});

test('the marketplace file lists the one plugin of ./plugin', () => {
    assert.equal(marketplace.name, 'uniquedomains');
    assert.equal(marketplace.owner.name, 'Unique Domains');
    assert.equal(marketplace.plugins.length, 1);
    assert.equal(marketplace.plugins[0].name, claude.name);
    assert.equal(marketplace.plugins[0].source, './plugin');
});

test('the Devin folder follows Devin\'s validator and copies the skill byte for byte', () => {
    const allowed = ['name', 'displayName', 'description', 'shortDescription', 'setup', 'homepage', 'repository', 'logo', 'keywords', 'mcpServers'];
    assert.deepEqual(Object.keys(devin).filter((key) => !allowed.includes(key)), []);
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
