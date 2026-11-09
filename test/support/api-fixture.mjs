/*----------------------------------
- FIXTURE API
----------------------------------*/

/**
 * An in-process stand-in for `https://api.unique.domains/v1`: replays the recorded keyless answers
 * (`test/fixtures/recorded/`, `scripts/record-fixtures.mjs`) and answers synthetic ones for what a keyless recording
 * cannot hold: a member key's `GET /meta/key`, the problem shapes, a 202 and the 429s. Each request is kept in
 * `requests` so a test can read the headers the server sent.
 *
 * Synthetic answers follow the document's examples; production never sent them to this repository.
 */

import { createServer } from 'node:http';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RECORDED = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'recorded');

export const FOUNDER_KEY = `ud_live_${'f'.repeat(40)}`;
export const INVESTOR_KEY = `ud_live_${'i'.repeat(40)}`;
export const UNPAID_KEY = `ud_live_${'u'.repeat(40)}`;
export const REFUSED_KEY = `ud_live_${'r'.repeat(40)}`;

const loadRecorded = () => {
    const answers = new Map();
    for (const file of readdirSync(RECORDED)) {
        const recording = JSON.parse(readFileSync(join(RECORDED, file), 'utf8'));
        answers.set(recording.path, recording);
    }
    return answers;
};

export const problem = (status, code, detail, extra = {}) => ({
    status,
    headers: { 'Content-Type': 'application/problem+json', ...(extra.headers ?? {}) },
    body: {
        type: `https://unique.domains/api/problems/${code}`,
        title: code,
        status,
        detail,
        instance: '/v1/fixture',
        code,
        ...(extra.body ?? {}),
    },
});

const keyAnswer = (plan) => ({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
        data: {
            access: 'member',
            plan,
            keyPrefix: 'ud_live_xxxx',
            listing: null,
            subscription: null,
            month: '2026-11',
            resetsOn: '2026-12-01',
            calls: { used: 1, allowance: 10000 },
            liveChecks: { used: 0, allowance: 100 },
            appraisals: { used: 0, allowance: 50 },
            intakes: { used: 0, allowance: 10 },
            investorEndpoints: plan === 'investor',
        },
        meta: { asOf: null, cursor: null, limit: null },
        links: { self: 'https://api.unique.domains/v1/meta/key', next: null, register: null, product: null, dataset: null },
    },
});

/**
 * Starts the fixture on a free port. `routes` adds or overrides answers by `METHOD /path?query` (a function receives
 * the request and returns `{ status, headers, body }`, or a list answered in turn).
 */
export const startApiFixture = async (routes = {}) => {
    const recorded = loadRecorded();
    const requests = [];
    const counters = new Map();
    const server = createServer((req, res) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
            const url = new URL(req.url, 'http://fixture');
            const path = url.pathname.replace(/^\/v1/u, '');
            const key = `${req.method} ${path}${url.search}`;
            const body = chunks.length > 0 ? Buffer.concat(chunks).toString('utf8') : null;
            requests.push({ method: req.method, path, search: url.search, headers: req.headers, body });

            let answer;
            const route = routes[key] ?? routes[`${req.method} ${path}`];
            if (Array.isArray(route)) {
                const count = counters.get(key) ?? 0;
                counters.set(key, count + 1);
                answer = route[Math.min(count, route.length - 1)];
            } else if (typeof route === 'function') {
                answer = route({ ...req, path, search: url.search, body });
            } else if (route) {
                answer = route;
            } else if (path === '/meta/key') {
                const auth = req.headers.authorization ?? '';
                if (auth === `Bearer ${FOUNDER_KEY}`) answer = keyAnswer('founder');
                else if (auth === `Bearer ${INVESTOR_KEY}`) answer = keyAnswer('investor');
                else if (auth === `Bearer ${UNPAID_KEY}`) answer = keyAnswer(null);
                else if (auth === `Bearer ${REFUSED_KEY}`) answer = problem(401, 'invalid_key', 'This key was revoked.');
                else answer = problem(403, 'keyed_only', 'This endpoint needs a member key.');
            } else {
                const recording = recorded.get(`${path}${url.search}`);
                answer = recording
                    ? { status: recording.status, headers: { 'Content-Type': 'application/json' }, body: recording.body }
                    : problem(404, 'not_found', `No fixture answers ${req.method} ${path}${url.search}.`);
            }
            res.writeHead(answer.status, answer.headers ?? { 'Content-Type': 'application/json' });
            res.end(answer.body === undefined ? '' : JSON.stringify(answer.body));
        });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    return {
        base: `http://127.0.0.1:${port}/v1`,
        requests,
        close: () => new Promise((resolve) => server.close(resolve)),
    };
};
