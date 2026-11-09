#!/usr/bin/env node
/*----------------------------------
- RECORD FIXTURES
----------------------------------*/

/**
 * Records a few keyless answers of the live API into `test/fixtures/recorded/`, which the fixture API of the tests
 * replays (`test/support/api-fixture.mjs`). Run by hand when the document changes shape; the tests never call the
 * live API.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'test', 'fixtures', 'recorded');
const BASE = 'https://api.unique.domains/v1';

/** One request per pattern the tests read: a name, a list, an ending, a registrar, a venue, an edition, the market. */
const REQUESTS = [
    '/names/harbor.io',
    '/tlds?limit=3',
    '/tlds/ai',
    '/domains',
    '/registrars/namecheap/prices',
    '/venues/afternic',
    '/editions/founder/latest',
    '/market/sales',
    '/trends?limit=2',
];

await mkdir(OUT, { recursive: true });
for (const path of REQUESTS) {
    const response = await fetch(`${BASE}${path}`, { headers: { 'User-Agent': 'uniquedomains-mcp-server-fixtures' } });
    const body = await response.json();
    const file = `${path.replace(/^\//u, '').replace(/[^a-z0-9.]+/giu, '_')}.json`;
    await writeFile(join(OUT, file), `${JSON.stringify({ path, status: response.status, recordedOn: new Date().toISOString().slice(0, 10), body }, null, 2)}\n`);
    console.log(`${response.status} ${path} -> ${file}`);
}
