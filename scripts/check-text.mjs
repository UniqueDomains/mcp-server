#!/usr/bin/env node
/*----------------------------------
- CHECK TEXT: THE WRITING RULES OF UNIQUE DOMAINS
----------------------------------*/

/**
 * Fails when a file written by hand in this repository carries a character or a word the project's writing rules
 * ban: the em dash, the internal name of the scanner (say "scanner"), the names of the sales sources, and the score
 * and ranking words (AGENTS.md, Minimum Data Exposure). The two guards that must name those words to ban them, the
 * tool generator and the tests, are exempt from that last rule alone. The snapshot and the generated files are
 * the API's own published text and are checked by the API's repository, so they are left out here.
 *
 * The reader files (what a person or an assistant reads: every `*.md`, the directory sheets, the plugin bundle and
 * manifests, `server.json`, `glama.json`, `gemini-extension.json` and `package.json`'s description) also carry no word
 * that says where the data comes from (`WHERE_DATA_COMES_FROM`, Gaetan's rule of 2026-11-12, plan
 * `never-where-data-comes-from`, step M6). Code comments are not reader text and are not checked for it. A code span
 * (`no-store`, a field name) is not prose and is left out, and `READER_EXCEPTIONS` names each kept phrase with its
 * reason.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { whereDataComesFromIn } from './lib/tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'generated']);
const SKIP_FILES = new Set(['package-lock.json', 'openapi.json']);
const SKIP_PATHS = [join(ROOT, 'openapi'), join(ROOT, 'test', 'fixtures', 'recorded')];
// Every hand-written text file type, `.gitignore` included (review R1-13).
const TEXT = /\.([mc]?[jt]s|json|md|ya?ml|txt|html|sh|toml)$|^(LICENSE|\.gitignore|Dockerfile|\.dockerignore)$/;

// Built from parts so this file does not trip its own check.
const BANNED = [
    { pattern: new RegExp(String.fromCharCode(0x2014)), label: 'an em dash' },
    // No closing boundary, so the plural and every suffixed form are caught too (review R1-13).
    { pattern: new RegExp(`\\b${['dae', 'mon'].join('')}`, 'i'), label: 'the internal name of the scanner (write "scanner")' },
    { pattern: new RegExp([['name', 'bio'], ['dn', 'journal'], ['humble', 'worth']].map((parts) => parts.join('')).join('|'), 'i'), label: 'the name of a sales source' },
    { pattern: /\b(?:scores?|scoring|rank|rankings?|ranked|formula)\b/i, label: 'a score or ranking word', exempt: (file) => file === join(ROOT, 'scripts', 'lib', 'tools.mjs') || file === join(ROOT, 'scripts', 'check-text.mjs') || file.startsWith(join(ROOT, 'test') + sep) },
];

/** Whether a file is read by a person or an assistant, not run: checked for the words of `WHERE_DATA_COMES_FROM`. */
const READER_DIRS = ['directories', 'plugin', '.cursor-plugin', '.claude-plugin'].map((dir) => join(ROOT, dir) + sep);
const READER_FILES = ['server.json', 'glama.json', 'gemini-extension.json', '.zenodo.json'].map((file) => join(ROOT, file));
const isReaderFile = (file) => file.endsWith('.md') || READER_FILES.includes(file) || READER_DIRS.some((dir) => file.startsWith(dir));

/**
 * Phrases a reader file keeps although they match, each in the one file that may carry it, with its reason. "does not
 * store it": the connector's privacy line about the user's own IP address, a promise about what the connector keeps,
 * not about where the catalog's data comes from; the rule's reach over a user's own data is the plan's open decision
 * 10, so the line stays as approved until that is answered.
 */
const READER_EXCEPTIONS = [
    { file: join(ROOT, 'README.md'), phrase: 'and the connector does not store it' },
    { file: join(ROOT, 'plugin', 'README.md'), phrase: 'The connector itself does not store it' },
];

/** A reader line as the check reads it: code spans and the file's kept phrases taken out. */
const proseOf = (line, file = null) =>
    READER_EXCEPTIONS.filter((exception) => exception.file === file).reduce((rest, { phrase }) => rest.split(phrase).join(' '), line.replace(/`[^`]*`/gu, ' '));

const walk = async (dir) => {
    const files = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (SKIP_PATHS.some((skip) => path.startsWith(skip))) continue;
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) files.push(...(await walk(path)));
        } else if (TEXT.test(entry.name) && !SKIP_FILES.has(entry.name)) {
            files.push(path);
        }
    }
    return files;
};

const problems = [];
for (const file of await walk(ROOT)) {
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, index) => {
        for (const { pattern, label, exempt } of BANNED) if (pattern.test(line) && !exempt?.(file)) problems.push(`${relative(ROOT, file)}:${index + 1}: ${label}`);
        if (isReaderFile(file)) {
            for (const words of whereDataComesFromIn(proseOf(line, file))) problems.push(`${relative(ROOT, file)}:${index + 1}: says where the data comes from ("${words}")`);
        }
    });
}

// `package.json` is code but for its description, which npm and the registries show.
const { description } = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
for (const words of whereDataComesFromIn(proseOf(description))) problems.push(`package.json: description says where the data comes from ("${words}")`);

if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exitCode = 1;
} else {
    console.log('The text rules hold.');
}
