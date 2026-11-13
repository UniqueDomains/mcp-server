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
import { readFileSync } from 'node:fs';

import {
    DESCRIBED_AHEAD_OF_SDK,
    DESCRIPTION_MAX_LENGTH,
    FORBIDDEN_WORDS,
    HOSTED_EXCLUDED_OPERATIONS,
    TRANSPORT_OPERATIONS,
    UNREGISTERED_OPERATIONS,
    textsOf,
    whereDataComesFromIn,
} from '../scripts/lib/tools.mjs';
import { GUIDANCE } from '../scripts/lib/guidance.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const free = TOOLS.filter((tool) => tool.tier === 'free');
const hosted = TOOLS.filter((tool) => tool.hosted);
const keyed = TOOLS.filter((tool) => tool.tier === 'keyed');

test('55 free tools, 51 on the hosted connector, every keyed operation as a keyed tool', () => {
    assert.equal(free.length, 55);
    assert.equal(hosted.length, 51);
    assert.equal(keyed.length, Object.values(OPERATIONS).filter((operation) => operation.tier === 'keyed').length);
    assert.equal(TOOLS.length, 80);
    assert.equal(TOOLS.length, Object.keys(OPERATIONS).length - TRANSPORT_OPERATIONS.length - UNREGISTERED_OPERATIONS.length);
});

test('the transport operations, the unregistered ones and the hosted exclusions', () => {
    for (const id of [...TRANSPORT_OPERATIONS, ...UNREGISTERED_OPERATIONS]) assert.ok(!TOOLS.some((tool) => tool.operationId === id), id);
    // Gaetan's 3B of 2026-11-13: the freshness endpoint stays in the API, and the server registers no tool for it.
    assert.ok(OPERATIONS.get_meta_freshness, 'the API still has the endpoint');
    assert.ok(!TOOLS.some((tool) => tool.name === 'ud_get_meta_freshness'));
    for (const id of HOSTED_EXCLUDED_OPERATIONS) {
        const tool = TOOLS.find((candidate) => candidate.operationId === id);
        assert.equal(tool.tier, 'free', id);
        assert.equal(tool.hosted, false, id);
    }
    assert.ok(hosted.every((tool) => tool.tier === 'free'));
    // P-1: the same data as ud_get_name stays on npm only.
    assert.ok(!hosted.some((tool) => tool.name === 'ud_get_domain'));
    assert.ok(free.some((tool) => tool.name === 'ud_get_domain'));
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
    assert.equal(TOOLS.find((tool) => tool.name === 'ud_get_word_endings').title, "A word's endings");
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
    assert.equal(selectTools(TOOLS, 'local', 'none').length, 55);
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
    assert.match(tool.description, /A word with no count yet answers null; zeros are real\./u);

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
    assert.ok(skill.includes('A word with no count yet answers null; zeros are real'));
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

/* ---------- No text says where the data comes from (plan `never-where-data-comes-from`, step M6) ---------- */

/**
 * `fields` lists the answer's own key names (`scan` among them): field names are the API's contract and stay in v1
 * (Gaetan's 2A of 2026-11-13), so that list is not prose.
 */
const proseOfTool = (text) => text.replace(/Comma-separated top-level keys to keep: [^.]*\./u, '');

/** Every `description` inside a schema. */
const descriptionsOf = (node) => {
    if (Array.isArray(node)) return node.flatMap(descriptionsOf);
    if (node === null || typeof node !== 'object') return [];
    return [...(typeof node.description === 'string' ? [node.description] : []), ...Object.values(node).flatMap(descriptionsOf)];
};

test('the guard catches every form the rule bans, and lets the paid operation and a trademark status through', () => {
    for (const banned of ['The stored answer.', 'Read from storage.', 'The catalog stores the name.', 'The scanner saw it.', 'Scanned names.', 'The registry sync.', 'Not a live reading.', 'Not live.', 'Never live.', 'A live lookup.', 'A live read.', 'It reads live.', 'Reads one name live from its registry.', 'The catalog scans every ending.', 'Rescanned daily.', 'A crawler.', 'From the nightly update.', 'Totals as of 2026-11-13.', 'The record carries its day.', 'The day it is from.', "A word's endings on the latest day.", 'On the latest footprint day.', 'How current each part of the data is.', 'How fresh it is.', 'Checked on 3 Oct.', 'Checked just now.', 'The list as IANA publishes it.', 'The round as ICANN names it.']) {
        assert.ok(whereDataComesFromIn(banned).length > 0, banned);
    }
    for (const kept of ['Runs a live check of one name.', 'Each call spends one live check of the month.', 'A mark whose status is `live` or `dead`.', 'A daily record, read every day.', "Say the edition's date.", 'The IANA registrar list, by IANA id.', "ICANN's 2026 round."]) {
        assert.deepEqual(whereDataComesFromIn(kept), [], kept);
    }
});

test('no tool text says where the data comes from, on either profile, keyed tools included', async () => {
    const { inputSchemaFor, outputSchemaFor } = await import('../dist/index.js');
    for (const tool of TOOLS) {
        const texts = [...textsOf(tool)];
        // The hosted profile rewrites some input texts: its descriptions are read too (field names are not text).
        if (tool.hosted) texts.push(...descriptionsOf([inputSchemaFor(tool, 'hosted', 'none'), outputSchemaFor(tool, 'hosted')]));
        for (const text of texts) assert.deepEqual(whereDataComesFromIn(proseOfTool(text)), [], `${tool.name}: "${text}"`);
    }
});

test('the tool texts of the 0.1.6 round read as the plan words them', () => {
    const tool = (name) => TOOLS.find((entry) => entry.name === name);
    assert.equal(tool('ud_get_name').title, 'Answer for one domain name');
    assert.equal(tool('ud_get_name_registry').title, 'Registry record of one name');
    // Gaetan's 17A of 2026-11-13: no text brings up the record's day; the answer keeps `observedOn` (18A).
    assert.doesNotMatch(tool('ud_get_name_registry').description, /\bday\b/u);
    assert.ok('observedOn' in tool('ud_get_name_registry').outputSchema.properties.data.properties);
    assert.match(tool('ud_get_name_value').description, /it runs no new estimate\./u);
    assert.match(tool('ud_check_name').description, /each call spends one live check of the month\./u);
    // Decision 16 (Gaetan's 4C of 2026-11-13): `not_checked` never reads as free, in the tool and in the skill.
    assert.match(tool('ud_get_name').description, /The status `not_checked` means no answer: the name may be taken\./u);
    for (const file of [join(ROOT, 'plugin', 'skills', 'unique-domains', 'SKILL.md'), join(ROOT, 'GEMINI.md')]) {
        assert.ok(readFileSync(file, 'utf8').includes('- A name outside the catalog answers the status `not_checked`. Say that the catalog has no answer for it and that the name may well be taken, never that it is free.'), file);
    }
    assert.equal(tool('ud_get_name').justification.readOnly, 'Read-only: it reads the Unique.domains catalog and changes nothing.');
    assert.equal(tool('ud_get_name').justification.openWorld, 'Closed world: it reads the Unique.domains catalog only.');
    assert.equal(tool('ud_check_name').justification.openWorld, 'Open world: the check reaches beyond the Unique.domains catalog.');
    // Deeper fields reached by path, through `items` and `anyOf`.
    const data = (name) => tool(name).outputSchema.properties.data;
    assert.equal(data('ud_get_venue').properties.footprint.anyOf[0].properties.names.description, 'Tracked names parked at the venue, rounded (to 100, to 10 under 1,000).');
    assert.equal(data('ud_batch_names').items.anyOf[0].properties.tracked.description, 'The name is in the catalog.');
    // The batch row of a name outside the catalog keeps its own text: one path, two fields (review of 2026-11-13).
    assert.equal(data('ud_batch_names').items.anyOf[1].properties.tracked.description, 'Always false here.');
    assert.equal(data('ud_list_tld_application_changes').items.properties.seenAt.description, 'When the change was seen.');
    assert.equal(data('ud_get_tld_application_string').properties.changes.items.properties.seenAt.description, 'When the change was seen.');
    assert.equal(data('ud_batch_words').items.anyOf[0].properties.pos.description, 'Parts of speech, comma-joined tags.');
    assert.equal(data('ud_list_tld_changes').items.properties.seenOn.description, 'UTC day the change was seen.');
});

/**
 * The texts this server carries ahead of the SDK in the 0.1.6 round, each with the SDK 0.2.0 document's text it
 * replaces. The day the SDK's document says something else for one of them without the old words, the platform has
 * shipped its own text: if it equals the copy, `npm run generate` shows no change and the copy goes; if it differs, this
 * test fails, so the two never drift apart (plan `never-where-data-comes-from`, decision D-a).
 *
 * Not compared, since the server words them for an assistant rather than a developer (plan, step P2): `check_name`
 * ("the full name answer"), `appraise_name` ("the value estimate"), `batch_names` (the platform's summary says
 * "resource"), and the list rows' `status`, the server's own longer sentence.
 */
const AHEAD_OF_SDK_0_1_6 = [
    { operationId: 'get_name', field: 'summary', sdk: 'The stored answer for one domain name: status, drop day, price today, registry facts, word facts and similar sales.' },
    { operationId: 'get_name_prices', field: 'summary', sdk: 'Every stored registrar quote for one name, and the renewal-trap flag.' },
    { operationId: 'get_name_registry', field: 'summary', sdk: 'The latest stored registry record of one name: dates, registrar, status codes, nameservers, DNSSEC and holder.' },
    { operationId: 'get_name_registry_history', field: 'summary', sdk: 'The stored registry record versions of one name and what moved between them.' },
    { operationId: 'get_name_dns', field: 'summary', sdk: 'The latest stored DNS reading of one name, with its parking venue.' },
    { operationId: 'get_word_endings', field: 'summary', sdk: "A word's endings as the nightly update holds them: counts, the key endings and open names per ending." },
    // The round of the three rules (Gaetan's 17A and 20A of 2026-11-13).
    { operationId: 'get_catalog_stats', field: 'summary', sdk: 'Catalog headline totals for the latest day.' },
    { operationId: 'get_tld_stats', field: 'summary', sdk: "The ending's latest market figures, and with history its last daily rows." },
    { operationId: 'get_registrar_footprint', field: 'summary', sdk: 'Names tracked under the registrar on the latest footprint day, rounded, with its top endings.' },
    { operationId: 'get_word_notability', field: 'summary', sdk: "A word's Wikipedia and Wikidata facts." },
    { operationId: 'list_tld_application_changes', field: 'summary', sdk: 'Every recorded status or contention change of the round, newest first.' },
    { operationId: 'list_tld_applications', field: 'summary', sdk: 'The 2026 new gTLD round as ICANN publishes it, A to Z, with two simple bands.' },
    { operationId: 'list_tld_applications', field: 'applicant', sdk: 'Applicant as ICANN names it.' },
    { operationId: 'get_tld_application_string', field: 'applications.applicant', sdk: 'Applicant as ICANN names it.' },
    { operationId: 'list_iana_registrars', field: 'name', sdk: 'Name as IANA publishes it.' },
    { operationId: 'get_iana_registrar', field: 'name', sdk: 'Name as IANA publishes it.' },
    { operationId: 'list_registrars', field: 'accredited', sdk: 'The IANA record says accredited.' },
    { operationId: 'list_venues', field: 'accredited', sdk: 'The IANA record says accredited.' },
    { operationId: 'get_venue', field: 'accredited', sdk: 'The IANA record says accredited.' },
    { operationId: 'get_venue', field: 'listingTerms', sdk: 'The verified listing terms: commission bands, exclusivity, payment plans, fast transfer, payout days, the day a person checked them.' },
    { operationId: 'get_name_value', field: 'summary', sdk: 'The stored value estimate of one name and its last 20 estimates.' },
    { operationId: 'get_word_market', field: 'summary', sdk: "A word's sales and auction aggregates from the nightly update." },
    { operationId: 'list_iana_registrars', field: 'summary', sdk: 'The IANA registrar list as the registry sync stores it, by id.' },
    { operationId: 'get_name', field: 'tracked', sdk: 'The catalog stores the name.' },
    { operationId: 'batch_names', field: 'tracked', sdk: 'The catalog stores the name.' },
    { operationId: 'check_name', field: 'tracked', sdk: 'The catalog stores the name.' },
    { operationId: 'get_domain', field: 'tracked', sdk: 'The catalog stores the name.' },
    // SDK 0.2.0 gives this field no description; the platform's text is the 0.1.5 round's, reworded in this one.
    { operationId: 'get_name', field: 'status', sdk: null },
    { operationId: 'check_name', field: 'checked', sdk: 'The live read answered.' },
    { operationId: 'get_word', field: 'pos', sdk: 'Parts of speech as stored, comma-joined tags.' },
    { operationId: 'batch_words', field: 'pos', sdk: 'Parts of speech as stored, comma-joined tags.' },
    { operationId: 'get_word_request', field: 'scan', sdk: 'On `ready` with a word: whether the first scan of every ending ran.' },
    { operationId: 'list_tld_changes', field: 'seenOn', sdk: 'UTC day the scanner saw the change.' },
    { operationId: 'list_venues', field: 'footprint.names', sdk: 'Scanned names parked at the venue, rounded (to 100, to 10 under 1,000).' },
    { operationId: 'get_venue', field: 'footprint.names', sdk: 'Scanned names parked at the venue, rounded (to 100, to 10 under 1,000).' },
    { operationId: 'list_tld_application_changes', field: 'seenAt', sdk: 'Timestamp the import saw it.' },
    { operationId: 'get_tld_application_string', field: 'changes.seenAt', sdk: 'Timestamp the import saw it.' },
];

const SDK_DOCUMENT = JSON.parse(readFileSync(join(ROOT, 'node_modules', '@uniquedomains', 'sdk', 'openapi.json'), 'utf8'));

const operationIn = (document, operationId) =>
    Object.values(document.paths)
        .flatMap((item) => Object.values(item))
        .find((candidate) => candidate && candidate.operationId === operationId);

/** The description the document gives a field of the 200 answer's `data`, by dotted path, through refs, items and branches. */
const documentFieldText = (document, operationId, path) => {
    const resolve = (node) => (node && typeof node.$ref === 'string' ? resolve(document.components.schemas[node.$ref.replace('#/components/schemas/', '')]) : node);
    const find = (node, segments) => {
        node = resolve(node);
        if (!node || typeof node !== 'object') return null;
        if (segments.length === 0) return node.description ?? (node.oneOf ?? node.anyOf ?? []).map(resolve).find((branch) => branch?.description)?.description ?? null;
        const [head, ...rest] = segments;
        if (node.properties?.[head]) return find(node.properties[head], rest);
        if (node.items) return find(node.items, segments);
        for (const branch of node.oneOf ?? node.anyOf ?? node.allOf ?? []) {
            const found = find(branch, segments);
            if (found !== null) return found;
        }
        return null;
    };
    const schema = operationIn(document, operationId).responses['200'].content['application/json'].schema;
    return find(resolve(schema).properties.data, path.split('.'));
};

test('each copy ahead of the SDK still replaces the SDK text it names, and matches the SDK the day it ships its own', () => {
    for (const { operationId, field, sdk } of AHEAD_OF_SDK_0_1_6) {
        const copy = field === 'summary' ? GUIDANCE[operationId].summary : DESCRIBED_AHEAD_OF_SDK[operationId][field];
        assert.ok(typeof copy === 'string' && whereDataComesFromIn(copy).length === 0, `${operationId}.${field}: the server's copy`);
        const text = field === 'summary' ? operationIn(SDK_DOCUMENT, operationId).summary : documentFieldText(SDK_DOCUMENT, operationId, field);
        if (text === sdk || (text !== null && whereDataComesFromIn(text).length > 0)) continue;
        assert.equal(text, copy, `${operationId}.${field}: the SDK's document now says another text; take it here, or drop the copy when they are equal`);
    }
});
