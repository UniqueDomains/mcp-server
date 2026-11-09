/*----------------------------------
- THE PUBLIC PAGE OF EACH ANSWER
----------------------------------*/

/**
 * `links.details` on the hosted profile (plan decision 3): the website page about the answer's subject, keyed by
 * operation. The API's own `links.details` wins whenever an answer carries one (it fills it on some paths already);
 * this map covers the rest, and goes the day the API fills every path. The nightly contract workflow requests one
 * sample of each pattern (`scripts/check-details.mjs`), so a route change on the website shows within a day.
 *
 * A word has no page on the website: its tools answer null.
 */

import type { JsonObject, JsonValue } from '@uniquedomains/sdk';

export const WEBSITE = 'https://unique.domains';

type Input = Readonly<Record<string, JsonValue | undefined>>;
type DetailsRule = (input: Input, data: JsonValue | undefined) => string | null;

const segment = (value: JsonValue | undefined): string | null =>
    typeof value === 'string' && value.trim() !== '' ? encodeURIComponent(value.trim().toLowerCase()) : null;

const page =
    (path: string): DetailsRule =>
    () =>
        `${WEBSITE}${path}`;

/** `/<prefix>/<input[key]>`, or the hub when the input is missing. */
const pageOf =
    (prefix: string, key: string): DetailsRule =>
    (input) => {
        const value = segment(input[key]);
        return value === null ? `${WEBSITE}${prefix}` : `${WEBSITE}${prefix}/${value}`;
    };

/** The website's registrar slugs: the API's `name.com` is `/registrars/name-com`. */
export const registrarSlug = (registrar: string): string => registrar.toLowerCase().replace(/\./gu, '-');

const registrarPage: DetailsRule = (input) => {
    const value = typeof input.registrar === 'string' ? input.registrar : null;
    return value === null ? `${WEBSITE}/registrars` : `${WEBSITE}/registrars/${encodeURIComponent(registrarSlug(value))}`;
};

/**
 * One ending: `/tld/<ending>` exists for the public set only (`/tld/aaa` answers 404, review finding 3), and only
 * `get_tld`'s answer says whether the ending is in it (its `quality` band is set for the public set alone). The other
 * ending tools answer no such flag, so they point at the `/tld` hub. A leading dot is stripped, as the API does.
 */
const tldPage: DetailsRule = (input, data) => {
    const raw = typeof input.tld === 'string' ? input.tld.trim().replace(/^\./u, '') : '';
    const publicSet = isRecord(data) && typeof data.quality === 'string' && data.quality !== '';
    const tld = segment(raw);
    return publicSet && tld !== null ? `${WEBSITE}/tld/${tld}` : `${WEBSITE}/tld`;
};

const isRecord = (value: JsonValue | undefined): value is JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value);

/** A domain read by name or id: the name from the answer when the caller passed an id. */
const domainPage: DetailsRule = (input, data) => {
    const fromData = isRecord(data) ? segment(data.name) : null;
    const name = fromData ?? (typeof input.nameOrId === 'string' && input.nameOrId.includes('.') ? segment(input.nameOrId) : null);
    return name === null ? `${WEBSITE}/domains` : `${WEBSITE}/availability/${name}`;
};

const EDITION_PAGES: Readonly<Record<string, string>> = { founder: '/business-ideas', investor: '/trending-domains' };

const editionPage: DetailsRule = (input) => {
    const path = typeof input.persona === 'string' ? EDITION_PAGES[input.persona] : undefined;
    if (path === undefined) return null;
    const date = typeof input.date === 'string' && /^\d{4}-\d{2}-\d{2}$/u.test(input.date) ? `/${input.date}` : '';
    return `${WEBSITE}${path}${date}`;
};

const none: DetailsRule = () => null;

/** One rule per free tool (the hosted profile serves free tools only). */
export const DETAILS_RULES: Readonly<Record<string, DetailsRule>> = {
    // A name: its status, price, comps and auction on the availability page, its registry and DNS on WHOIS.
    get_name: pageOf('/availability', 'name'),
    get_name_comps: pageOf('/availability', 'name'),
    get_name_auction: pageOf('/availability', 'name'),
    get_name_registry: pageOf('/whois', 'name'),
    get_name_dns: pageOf('/whois', 'name'),
    // A word has no page.
    resolve_word: none,
    list_word_categories: none,
    get_word_endings: none,
    get_word_notability: none,
    get_word_market: none,
    // The catalog: its lists on /domains, one name on its availability page, the drops on the WHOIS hub.
    list_domains: page('/domains'),
    get_domain: domainPage,
    get_domain_drops: page('/whois'),
    list_domain_hacks: page('/domains'),
    get_catalog_stats: page('/domains'),
    // Endings.
    list_tlds: page('/tld'),
    get_meta_tlds: page('/tld'),
    get_tld: tldPage,
    get_tld_stats: page('/tld'),
    list_tld_phases: page('/tld'),
    list_tld_changes: page('/tld'),
    list_tld_keywords: page('/tld'),
    list_tld_applications: page('/tld/applications'),
    list_tld_application_changes: page('/tld/applications'),
    get_tld_application_string: page('/tld/applications'),
    // Registrars and venues (a venue's profile lives under /registrars too).
    list_registrars: page('/registrars'),
    list_registrar_prices: registrarPage,
    list_registrar_changes: registrarPage,
    list_tld_prices: page('/registrars'),
    list_price_changes: page('/registrars'),
    list_price_traps: page('/registrars'),
    list_venues: page('/registrars'),
    get_venue: pageOf('/registrars', 'id'),
    list_iana_registrars: page('/registrars'),
    get_iana_registrar: page('/registrars'),
    // The market.
    get_market_sales: page('/sales'),
    list_market_sales_series: page('/sales'),
    list_market_sales_endings: page('/sales'),
    get_market_sales_lengths: page('/sales'),
    list_market_sales_movers: page('/sales'),
    get_market_sales_word: page('/sales'),
    get_market_auctions: page('/auctions'),
    list_market_auctions_sample: page('/auctions'),
    list_market_auction_venues: page('/auctions'),
    // Trends and the daily editions.
    list_trends: page('/trending-domains'),
    get_trend: pageOf('/trending-domains/trends', 'slug'),
    list_trend_categories: page('/trending-domains'),
    get_latest_edition: editionPage,
    get_edition: editionPage,
    // Events and the agenda.
    list_events: page('/agenda'),
    get_event: page('/agenda'),
    get_agenda: page('/agenda'),
    // Reference lists: no page of their own.
    get_meta_enums: none,
    get_meta_freshness: none,
    list_meta_datasets: none,
    list_meta_trademark_classes: none,
    get_meta_providers: none,
};

/** The page for one answer: the API's own value when it sent one, else the rule's, else null. */
export const detailsFor = (operationId: string, input: Input, data: JsonValue | undefined, fromApi: JsonValue | undefined): string | null => {
    if (typeof fromApi === 'string' && fromApi !== '') return fromApi;
    const rule = DETAILS_RULES[operationId];
    return rule === undefined ? null : rule(input, data);
};

/** One sample input per pattern, for the nightly check that each page answers 200 (`scripts/check-details.mjs`). */
export const DETAILS_SAMPLES: readonly { readonly operationId: string; readonly input: Input; readonly data?: JsonValue }[] = [
    { operationId: 'get_name', input: { name: 'harbor.io' } },
    { operationId: 'get_name_registry', input: { name: 'harbor.io' } },
    { operationId: 'list_domains', input: {} },
    // A public-set ending (its answer carries the band) and one outside the set, which points at the hub.
    { operationId: 'get_tld', input: { tld: 'ai' }, data: { quality: 'prime' } },
    { operationId: 'get_tld', input: { tld: 'aaa' }, data: { quality: null } },
    { operationId: 'list_tlds', input: {} },
    { operationId: 'list_tld_applications', input: {} },
    { operationId: 'list_registrars', input: {} },
    { operationId: 'list_registrar_prices', input: { registrar: 'name.com' } },
    { operationId: 'get_venue', input: { id: 'afternic' } },
    { operationId: 'get_market_sales', input: {} },
    { operationId: 'get_market_auctions', input: {} },
    { operationId: 'list_trends', input: {} },
    { operationId: 'get_latest_edition', input: { persona: 'founder' } },
    { operationId: 'get_latest_edition', input: { persona: 'investor' } },
    { operationId: 'get_agenda', input: {} },
];
