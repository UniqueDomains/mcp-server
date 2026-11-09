#!/usr/bin/env node
/*----------------------------------
- CHECK THE DETAILS PAGES
----------------------------------*/

/**
 * Requests one website page per `links.details` pattern of the hosted profile (`src/details.ts`, plan decision 3) and
 * fails on any answer but 200, so a route the website moves is caught by the nightly contract workflow within a day.
 * The trend sample reads a real slug from the live API first.
 */

import { DETAILS_SAMPLES, detailsFor } from '../dist/index.js';

const samples = [...DETAILS_SAMPLES];
const trends = await fetch('https://api.unique.domains/v1/trends?limit=1').then((response) => response.json());
const slug = trends?.data?.[0]?.slug;
if (typeof slug === 'string') samples.push({ operationId: 'get_trend', input: { slug } });

const urls = [...new Set(samples.map(({ operationId, input, data }) => detailsFor(operationId, input, data ?? null, undefined)).filter((url) => url !== null))];
const failures = [];
for (const url of urls) {
    const response = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'uniquedomains-mcp-server-contract' } });
    console.log(`${response.status} ${url}`);
    if (response.status !== 200) failures.push(`${response.status} ${url}`);
}
if (failures.length > 0) {
    console.error(`Details pages that do not answer 200:\n${failures.join('\n')}`);
    process.exitCode = 1;
}
