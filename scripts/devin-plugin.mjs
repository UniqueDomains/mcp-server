#!/usr/bin/env node
/*----------------------------------
- THE DEVIN PLUGIN FOLDER
----------------------------------*/

/**
 * Builds `dist/devin/plugins/unique-domains/`, the folder a pull request copies into `plugins/` of
 * `CognitionAI/devin-marketplace`, from the bundle's own texts and skill (plugin bundle plan, decision 9).
 *
 * Devin's validator (`scripts/validate.py` of that repository, re-read on 2026-11-11) allows only these keys in
 * `.devin-plugin/plugin.json`: name, displayName, description, shortDescription, setup, homepage, repository, logo,
 * keywords, mcpServers. It wants `name` equal to the folder, a `shortDescription` of 40 characters at most, and no
 * `plugin.json`, `.mcp.json` or `mcp.json` beside the manifest. Its `README.md` asks for a description of 60 to 130
 * characters, without a trailing period, "integration" or "MCP server". The text rules are checked here and fail the
 * build; the keys, the folder name, the logo and the files beside the manifest are held by `test/plugin.test.mjs`.
 *
 * The folder holds the manifest, a 256 px logo (`assets/logo-256.png`) and a byte copy of the skill.
 */

import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { HOSTED_MCP_URL } from './lib/plugin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const argument = (name) => {
    const index = process.argv.indexOf(name);
    return index === -1 ? null : process.argv[index + 1];
};

const DEVIN_SLUG = 'unique-domains';

const claude = JSON.parse(await readFile(join(ROOT, 'plugin', '.claude-plugin', 'plugin.json'), 'utf8'));
const hosted = JSON.parse(await readFile(join(ROOT, 'plugin', '.mcp.json'), 'utf8')).mcpServers.uniquedomains;

const manifest = {
    name: DEVIN_SLUG,
    displayName: claude.displayName,
    description: "Check if a domain name is taken, compare nine registrars' prices and spot renewal traps, from a daily record of 37 million names",
    shortDescription: "Is that name taken? What does it cost?",
    homepage: claude.homepage,
    repository: claude.repository,
    logo: 'logo.png',
    keywords: ['Development Tools', 'Productivity'],
    mcpServers: { uniquedomains: { url: hosted.url } },
};

const problems = [];
const check = (condition, message) => {
    if (!condition) problems.push(message);
};
check(manifest.shortDescription.length > 0 && manifest.shortDescription.length <= 40, 'shortDescription: 40 characters at most');
check(manifest.description.length >= 60 && manifest.description.length <= 130, 'description: 60 to 130 characters');
check(!manifest.description.endsWith('.'), 'description: no trailing period');
check(!/integration|mcp server/iu.test(manifest.description), 'description: no "integration" and no "MCP server"');
check(manifest.mcpServers.uniquedomains.url === HOSTED_MCP_URL, 'mcpServers: the hosted connector');
if (problems.length > 0) {
    console.error(`The Devin plugin folder does not meet Devin's rules:\n- ${problems.join('\n- ')}`);
    process.exit(1);
}

const out = join(argument('--out') ?? join(ROOT, 'dist', 'devin'), 'plugins', DEVIN_SLUG);
await rm(out, { recursive: true, force: true });
await mkdir(join(out, '.devin-plugin'), { recursive: true });
await mkdir(join(out, 'skills', 'unique-domains'), { recursive: true });
await writeFile(join(out, '.devin-plugin', 'plugin.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await copyFile(join(ROOT, 'assets', 'logo-256.png'), join(out, 'logo.png'));
await copyFile(join(ROOT, 'plugin', 'skills', 'unique-domains', 'SKILL.md'), join(out, 'skills', 'unique-domains', 'SKILL.md'));
console.log(`${relative(ROOT, out)} written: .devin-plugin/plugin.json, logo.png, skills/unique-domains/SKILL.md.`);
