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
import { FORBIDDEN_WORDS, HOSTED_EXCLUDED_OPERATIONS, TRANSPORT_OPERATIONS, textsOf } from '../scripts/lib/tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const free = TOOLS.filter((tool) => tool.tier === 'free');
const hosted = TOOLS.filter((tool) => tool.hosted);
const keyed = TOOLS.filter((tool) => tool.tier === 'keyed');

test('56 free tools, 53 on the hosted connector, every keyed operation as a keyed tool', () => {
    assert.equal(free.length, 56);
    assert.equal(hosted.length, 53);
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

test('titles are short, descriptions one or two sentences ending with what to pass', () => {
    for (const tool of TOOLS) {
        assert.ok(tool.title.length > 3 && tool.title.length <= 100, tool.name);
        assert.match(tool.title, /^[A-Z0-9]/u, tool.name);
        const sentences = tool.description.split(/(?<=[.?!])\s+(?=[A-Z`])/u);
        assert.ok(sentences.length >= 1 && sentences.length <= 2, `${tool.name}: ${sentences.length} sentences`);
        assert.match(tool.description, /(Pass |Every input is optional|Takes no input)/u, tool.name);
        assert.ok(tool.description.length <= 400, tool.name);
    }
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
    assert.equal(selectTools(TOOLS, 'hosted', 'investor').length, 53);
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
