/*----------------------------------
- THE GENERATED TOOL SET
----------------------------------*/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPERATIONS } from '@uniquedomains/sdk';

import { TOOLS, selectTools } from '../dist/index.js';
import { DESCRIPTION_MAX_LENGTH, FORBIDDEN_WORDS, HOSTED_EXCLUDED_OPERATIONS, TRANSPORT_OPERATIONS, textsOf } from '../scripts/lib/tools.mjs';
import { GUIDANCE } from '../scripts/lib/guidance.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const free = TOOLS.filter((tool) => tool.tier === 'free');
const hosted = TOOLS.filter((tool) => tool.hosted);
const keyed = TOOLS.filter((tool) => tool.tier === 'keyed');

test('56 free tools, 51 on the hosted connector, every keyed operation as a keyed tool', () => {
    assert.equal(free.length, 56);
    assert.equal(hosted.length, 51);
    assert.equal(keyed.length, Object.values(OPERATIONS).filter((operation) => operation.tier === 'keyed').length);
    assert.equal(TOOLS.length, Object.keys(OPERATIONS).length - TRANSPORT_OPERATIONS.length);
});

test('the five transport operations and the hosted exclusions', () => {
    for (const id of TRANSPORT_OPERATIONS) assert.ok(!TOOLS.some((tool) => tool.operationId === id), id);
    for (const id of HOSTED_EXCLUDED_OPERATIONS) {
        const tool = TOOLS.find((candidate) => candidate.operationId === id);
        assert.equal(tool.tier, 'free', id);
        assert.equal(tool.hosted, false, id);
    }
    assert.ok(hosted.every((tool) => tool.tier === 'free'));
    // P-1 and P-2: the same data as ud_get_name, and the pipeline's state, stay on npm only.
    assert.ok(!hosted.some((tool) => tool.name === 'ud_get_domain' || tool.name === 'ud_get_meta_freshness'));
    assert.ok(free.some((tool) => tool.name === 'ud_get_domain') && free.some((tool) => tool.name === 'ud_get_meta_freshness'));
});

test('names: ud_<operationId>, under 64 characters, unique', () => {
    const names = new Set();
    for (const tool of TOOLS) {
        assert.equal(tool.name, `ud_${tool.operationId}`);
        assert.ok(tool.name.length < 64, tool.name);
        assert.match(tool.name, /^[a-z0-9_]+$/u);
        assert.ok(!names.has(tool.name), tool.name);
        names.add(tool.name);
    }
});

test('every annotation set explicitly, with a justification for each value', () => {
    for (const tool of TOOLS) {
        for (const hint of ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint']) assert.equal(typeof tool.annotations[hint], 'boolean', `${tool.name} ${hint}`);
        assert.equal(tool.annotations.destructiveHint, false, tool.name);
        for (const reason of ['readOnly', 'openWorld', 'destructive']) assert.ok(tool.justification[reason].length > 20, `${tool.name} ${reason}`);
    }
});

test('read-only except the three metered tools; open world only for the live check', () => {
    const writers = TOOLS.filter((tool) => !tool.annotations.readOnlyHint).map((tool) => tool.name).sort();
    assert.deepEqual(writers, ['ud_appraise_name', 'ud_check_name', 'ud_request_word']);
    assert.deepEqual(TOOLS.filter((tool) => tool.annotations.openWorldHint).map((tool) => tool.name), ['ud_check_name']);
    for (const tool of free) assert.equal(tool.annotations.readOnlyHint, true, tool.name);
});

test('titles are short; descriptions say what the tool reads, when to use it, then what to pass, within the bound', () => {
    for (const tool of TOOLS) {
        assert.ok(tool.title.length > 3 && tool.title.length <= 100, tool.name);
        assert.match(tool.title, /^[A-Z0-9]/u, tool.name);
        const sentences = tool.description.split(/(?<=[.?!])\s+(?=[A-Z`])/u);
        assert.ok(sentences.length >= 3 && sentences.length <= 5, `${tool.name}: ${sentences.length} sentences`);
        assert.match(tool.description, /\bUse it (?:when|first when|to)\b/u, tool.name);
        assert.match(tool.description, /(Pass |Every input is optional|Takes no input)[^]*\.$/u, tool.name);
        assert.ok(tool.description.length <= DESCRIPTION_MAX_LENGTH, `${tool.name}: ${tool.description.length} characters`);
    }
});

test('the guidance table names every emitted operation and nothing else, each with a use sentence', () => {
    const emitted = TOOLS.map((tool) => tool.operationId).sort();
    assert.deepEqual(Object.keys(GUIDANCE).sort(), emitted);
    for (const [id, entry] of Object.entries(GUIDANCE)) {
        assert.match(entry.use, /^Use it (?:when|first when|to) /u, id);
        assert.match(entry.use, /\.$/u, id);
        if (entry.summary !== undefined) assert.match(entry.summary, /^[A-Z].*\.$/u, id);
    }
});

test('a sample of the guidance table names a required input and reaches the description', () => {
    for (const [id, entry] of Object.entries(GUIDANCE)) {
        for (const [name, value] of Object.entries(entry.examples ?? {})) {
            assert.ok(OPERATIONS[id].parameters.some((parameter) => parameter.name === name && parameter.required), `${id}.${name}`);
            assert.ok(TOOLS.find((tool) => tool.operationId === id).description.includes(`\`${name}\` (such as ${value})`), `${id}.${name}`);
        }
    }
    // Review M1: the API document's samples for these four answered 404, or the investors' edition, on production.
    const texts = TOOLS.map((tool) => tool.description).join('\n');
    for (const stale of ['studio', 'padel', 'namescon-global-2026', '2026-11-02']) assert.ok(!texts.includes(`(such as ${stale})`), stale);
});

/**
 * Words a reader outside the team would not know, or that name how the data is made rather than what it says
 * (Anthropic policy 2.A, OpenAI's optimize-metadata page). Checked outside backticked input names (`persona` is one).
 */
const JARGON = [
    /\bscanner\b/iu,
    /\blanes?\b/iu,
    // A pass of the data, not the "Pass `name`" that opens the input clause.
    /\bpasses\b/iu,
    /\b(?:a|the|each|its|every|last) pass\b/iu,
    /\bsnapshots?\b/iu,
    /\brollups?\b/iu,
    /\bpipeline\b/iu,
    /\bnightly\b/iu,
    /\bsync\b/iu,
    /\bpersonas?\b/iu,
    /\bkeyed\b/iu,
    /\btiers?\b/iu,
    /\bplans?\b/iu,
    /\bresource\b/iu,
    /\b(?:GET|POST)\s+\//u,
    /\/v1\b/u,
];

test('no description or title carries internal words, outside backticked input names', () => {
    for (const tool of TOOLS) {
        for (const text of [tool.description, tool.title]) {
            const prose = text.replace(/`[^`]*`/gu, '');
            for (const word of JARGON) assert.ok(!word.test(prose), `${tool.name}: ${word} in "${text}"`);
        }
    }
    // The title follows a replaced summary (`ud_get_word_endings` no longer reads "as the nightly update holds them").
    assert.equal(TOOLS.find((tool) => tool.name === 'ud_get_word_endings').title, "A word's endings as stored on the latest day");
});

test('no tool text carries a score, a ranking or a sales source, nor an em dash', () => {
    for (const tool of TOOLS) {
        for (const text of textsOf(tool)) {
            for (const word of FORBIDDEN_WORDS) assert.ok(!word.test(text), `${tool.name}: ${word} in "${text}"`);
            assert.ok(!text.includes(String.fromCharCode(0x2014)), tool.name);
        }
    }
});

test('no description steers to another tool or compares', () => {
    for (const tool of TOOLS) {
        assert.ok(!/\bud_[a-z]/u.test(tool.description), tool.name);
        assert.ok(!/\b(best|better|cheaper than|unlike|instead of)\b/iu.test(tool.description), tool.name);
    }
});

test('input schemas follow the parameters: required path parameters, enums kept, limit shows 20, closed', () => {
    for (const tool of TOOLS) {
        const operation = OPERATIONS[tool.operationId];
        const schema = tool.inputSchema;
        assert.equal(schema.type, 'object');
        assert.equal(schema.additionalProperties, false);
        for (const parameter of operation.parameters) {
            const property = schema.properties[parameter.name];
            assert.ok(property, `${tool.name}.${parameter.name}`);
            assert.equal(property.type, parameter.type);
            if (parameter.enum) assert.deepEqual(property.enum, [...parameter.enum]);
            if (parameter.required) assert.ok(schema.required.includes(parameter.name));
            if (parameter.name === 'limit') assert.equal(property.default, 20);
        }
    }
});

test('output schemas: the envelope, no required key, no closed object, details declared', () => {
    const walk = (node, where) => {
        if (Array.isArray(node)) return node.forEach((item) => walk(item, where));
        if (node === null || typeof node !== 'object') return;
        assert.ok(!('required' in node && Array.isArray(node.required)), `${where}: required`);
        assert.notEqual(node.additionalProperties, false, `${where}: closed`);
        assert.ok(!('$ref' in node) && !('oneOf' in node) && !('example' in node), where);
        for (const value of Object.values(node)) walk(value, where);
    };
    for (const tool of TOOLS) {
        assert.equal(tool.outputSchema.type, 'object');
        assert.deepEqual(Object.keys(tool.outputSchema.properties), ['data', 'meta', 'links']);
        assert.ok(tool.outputSchema.properties.links.properties.details, tool.name);
        walk(tool.outputSchema, tool.name);
    }
});

test('the profiles and plans select the expected sets', () => {
    assert.equal(selectTools(TOOLS, 'local', 'none').length, 56);
    assert.equal(selectTools(TOOLS, 'hosted', 'investor').length, 51);
    const founder = selectTools(TOOLS, 'local', 'founder');
    const investor = selectTools(TOOLS, 'local', 'investor');
    assert.ok(founder.every((tool) => tool.tier === 'free' || tool.plan !== 'investor'));
    assert.ok(founder.some((tool) => tool.name === 'ud_get_key'));
    assert.ok(!founder.some((tool) => tool.name === 'ud_batch_names'));
    // The two free Investor tools are free: every local plan has them.
    for (const set of [selectTools(TOOLS, 'local', 'none'), founder, investor]) {
        assert.ok(set.some((tool) => tool.name === 'ud_get_word_notability'));
        assert.ok(set.some((tool) => tool.name === 'ud_get_word_market'));
    }
    assert.equal(investor.length, TOOLS.length);
});

test('the generated files match the installed SDK', () => {
    execFileSync(process.execPath, [join(ROOT, 'scripts', 'generate.mjs'), '--check'], { cwd: ROOT, stdio: 'pipe' });
});

// The three answers the directory fix round's reviewers read as wrong (2026-11-11): two were right by decision, and the
// description now says why, so a reviewer running the tool reads the answer it gets.
test('the editions and providers descriptions explain the answers that read as wrong', () => {
    const edition = TOOLS.find((tool) => tool.operationId === 'get_edition').description;
    // A founders' read of a day before 2026-11-10 answers the investors' edition (the API's D21 rule).
    assert.match(edition, /Before 2026-11-10[^.]*investors' edition[^.]*`investor`/u);
    const providers = TOOLS.find((tool) => tool.operationId === 'get_meta_providers').description;
    // The guarded venue is named on the auction answers only (decision 44, letter 1A): the list never claims all of them.
    assert.doesNotMatch(providers, /every (?:registrar, )?auction venue|seven/iu);
    assert.match(providers, /may be one this list leaves out/u);
});

// Decision B of 2026-11-11: the API answers a word with no endings count as null, not zeros; the declared schema takes
// it now, so a validating client accepts the answer before the SDK's document says so.
test('the word endings tool declares null counts and says so', async () => {
    const tool = TOOLS.find((entry) => entry.operationId === 'get_word_endings');
    const { byGroup, openByEnding } = tool.outputSchema.properties.data.properties;
    for (const field of [byGroup, openByEnding]) assert.ok(field.anyOf.some((branch) => branch.type === 'null'), JSON.stringify(field));
    assert.equal(byGroup.anyOf[0].type, 'object');
    // The platform's one null sentence (review R-4 of 2026-11-11), the same in the plugin skill.
    assert.match(tool.description, /A word with no count \(not scanned, or not counted yet\) answers null; zeros are real\./u);

    const { widenAheadOfSdk } = await import('../scripts/lib/tools.mjs');
    const already = { properties: { byGroup: { anyOf: [{ type: 'object' }, { type: 'null' }] }, openByEnding: { type: 'null' } } };
    assert.deepEqual(widenAheadOfSdk('get_word_endings', already), already, 'a no-op once the document is nullable');
    assert.throws(() => widenAheadOfSdk('get_word_endings', { properties: {} }), /no `byGroup` to widen/u);
});

// Review R-4 of 2026-11-11: the skill told an assistant that all zeros mean "not counted yet", the opposite of the
// answer since null means no count; the skill now carries the tool's own sentence. Review R-5: `/meta/enums` lists the
// same venues as `/meta/providers`, so its tool says the same thing.
test('the plugin skill and the enums tool say what null and the venue list mean', async () => {
    const { readFile } = await import('node:fs/promises');
    const skill = await readFile(join(ROOT, 'plugin', 'skills', 'unique-domains', 'SKILL.md'), 'utf8');
    assert.ok(skill.includes('A word with no count (not scanned, or not counted yet) answers null; zeros are real'));
    assert.ok(!/All zeros mean/u.test(skill));
    const enums = TOOLS.find((tool) => tool.operationId === 'get_meta_enums').description;
    assert.match(enums, /may be one this list leaves out/u);
});

// The directory quality audit of 2026-11-11 (Gaetan's 3A): inputs in a tool user's words, every one of them described
// on both profiles, and the answers' field descriptions that explain an edition's counts and the two status words.
test('every input is described in plain words, on the hosted profile too', async () => {
    const { inputSchemaFor } = await import('../dist/index.js');
    for (const tool of TOOLS.filter((entry) => entry.hosted)) {
        for (const [name, schema] of Object.entries(inputSchemaFor(tool, 'hosted', 'none').properties)) {
            assert.ok(typeof schema.description === 'string' && schema.description.length > 0, `${tool.name}.${name}`);
            // `fields` lists the answer's own key names (`lane` among them), which a caller passes back as they are.
            const prose = name === 'fields' ? schema.description.replace(/^Comma-separated top-level keys to keep: .*$/u, '') : schema.description;
            assert.doesNotMatch(prose, /validation_failed|\b400\b|\b(?:GET|POST) \/|\blanes?\b|\bv1\b/u, `${tool.name}.${name}`);
        }
    }
    const shape = TOOLS.find((tool) => tool.name === 'ud_list_domains');
    const hostedShape = inputSchemaFor(shape, 'hosted', 'none').properties.shape.description;
    assert.match(hostedShape, /^Comma list of word shapes.* Proper nouns are left out here\.$/u);
    // AF-3: the hosted connector takes no key, so its tool list never mentions one; the npm text keeps it.
    assert.doesNotMatch(hostedShape, /\bkey\b/u);
    assert.match(shape.inputSchema.properties.shape.description, /without a key\.$/u);
});

// AF-1 of the after-fix check of 2026-11-12: SDK 0.2.0's document still says three answers carry "UTM tags", the one
// text a directory reviewer reads about the links 2A cleaned. Nothing the hosted connector lists may say it.
test('no hosted tool names a tracking tag, in its description, inputs or answer schema', async () => {
    const { inputSchemaFor, outputSchemaFor } = await import('../dist/index.js');
    for (const tool of TOOLS.filter((entry) => entry.hosted)) {
        const listed = JSON.stringify([tool.title, tool.description, inputSchemaFor(tool, 'hosted', 'none'), outputSchemaFor(tool, 'hosted')]);
        assert.doesNotMatch(listed, /\bUTM\b|utm_/u, tool.name);
    }
    const venue = TOOLS.find((tool) => tool.name === 'ud_get_venue').outputSchema.properties.data.properties;
    assert.equal(venue.homepageUrl.description, "The registrar's or venue's homepage, with no tracking query.");
});

test('the answers explain an edition\'s counts and the two status words', () => {
    const data = (name) => TOOLS.find((tool) => tool.name === name).outputSchema.properties.data;
    for (const name of ['ud_get_latest_edition', 'ud_get_edition']) assert.match(data(name).properties.trendCount.description, /lists at most 20/u);
    assert.match(data('ud_get_name').properties.status.description, /`resell` is `for_sale`/u);
    for (const name of ['ud_list_domains', 'ud_list_domain_hacks']) assert.match(data(name).items.properties.status.description, /`resell` reads `for_sale`/u);
});
