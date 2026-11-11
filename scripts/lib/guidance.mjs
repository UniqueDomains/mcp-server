/*----------------------------------
- WHEN TO USE EACH TOOL
----------------------------------*/

/**
 * One entry per operation `buildTools` emits, keyed ones included (Glama and npm users read them too): `use`, the
 * sentence that tells an assistant when the tool is the right one (Anthropic's directory policy 2.A; OpenAI's
 * optimize-metadata page: purpose, when to use, limits), and optionally `summary`, which replaces the API document's
 * summary where that one carries words a reader outside the team would not know (the nightly update, the registry
 * sync, an HTTP route, a key's grade).
 *
 * Hand-written here, not in the API document (fix round P-3): the document feeds the SDK, the website reference and
 * RapidAPI, and a change there reaches this server only after an SDK release. Rewording the document's own summaries
 * is a later round.
 *
 * A `use` sentence starts "Use it when" (or "Use it first when", "Use it to") and names at most the one limit an
 * assistant must know: stored data, not a live reading; a fixed daily sample; one page at a time; a spent allowance.
 * It names no other tool, compares nothing and carries no plan talk (`test/tools.test.mjs`).
 *
 * Optionally `examples`, the sample value the description shows for a required input, in place of the API document's
 * (review M1 of 2026-11-11). Each one answered on production on 2026-11-11 and is chosen to keep answering: a frozen
 * edition day, a slug of a dated event row, a published trend and an applied-for string (none of these lookups is
 * bounded by date). `npm run smoke -- --live` calls each on the hosted profile, so one that stops answering shows.
 */

/** @type {Readonly<Record<string, { use: string, summary?: string, examples?: Readonly<Record<string, string>> }>>} */
export const GUIDANCE = {
    /* ---------- One name ---------- */
    get_name: {
        use: 'Use it when someone asks about one specific domain name: whether it is open or for sale, what it costs, when it drops. Stored data as of its day, not a live reading.',
    },
    batch_names: {
        summary: 'The stored answers for up to 100 domain names in one call.',
        use: 'Use it when screening a list of names at once; each name is read as stored, not live.',
    },
    check_name: {
        summary: 'Reads one name live from its registry and a registrar, stores the reading and returns the full name answer.',
        use: 'Use it when the stored answer is too old for a decision about one name; each call spends one live check of the month.',
    },
    get_name_prices: {
        use: "Use it when someone wants every registrar's price for one name, or asks whether its renewal jumps after the first year.",
    },
    get_name_registry: {
        use: 'Use it when someone asks who holds a name, when it was registered or when it expires. A stored record, not a live lookup.',
    },
    get_name_registry_history: {
        use: "Use it when someone asks how a name's registration changed over time, such as a new registrar or a new expiry.",
    },
    get_name_dns: {
        use: 'Use it when someone asks whether a name points anywhere or is parked, and with which parking service.',
    },
    list_name_changes: {
        use: "Use it when someone wants the timeline of one name's events; it answers one page at a time.",
    },
    get_name_history: {
        summary: 'The web history of one name in bands: archive captures, authority band and language.',
        use: 'Use it when someone asks whether a name carried a website before and how established it was.',
    },
    get_name_value: {
        use: 'Use it when someone asks what a name is worth; it reads the stored estimate and runs no new one.',
    },
    appraise_name: {
        summary: 'Runs the appraisal of one stored name when its estimate is missing, and returns the value estimate.',
        use: 'Use it when a name has no stored estimate yet; each call spends one appraisal of the month.',
    },
    get_name_comps: {
        // After-fix check AF-1 of 2026-11-11: `endingsSoldOn` is a count, never the endings themselves.
        summary: 'The similar-sales aggregate of one name and how many endings its word sold on.',
        use: 'Use it when someone asks what similar names sold for, or on how many endings the word sold.',
    },
    get_name_auction: {
        use: 'Use it when someone asks whether a name is at auction now, its current bid or its deadline.',
    },

    /* ---------- Words ---------- */
    resolve_word: {
        use: 'Use it first when a word is misspelled, plural or unclear, to find the catalog word the word tools take.',
    },
    list_word_categories: {
        use: 'Use it when someone wants the word categories to browse or filter by.',
    },
    batch_words: {
        use: 'Use it when comparing a list of words at once.',
    },
    list_words: {
        use: 'Use it when looking for words by meaning, length, style or category; it answers one page at a time.',
    },
    get_word: {
        use: 'Use it when someone asks what a word means, where it comes from or how it is used.',
    },
    get_word_endings: {
        summary: "A word's endings as stored on the latest day: counts, the key endings and the open names per ending.",
        // The one limit (2026-11-11, decision B; the platform's one sentence of review R-4): null is "no count", never
        // zeros that read as "no names"; an unscanned word keeps its null for good, so the sentence names both cases.
        use: 'Use it when someone has a word and asks which endings are still open for it, such as harbor.ai. A word with no count (not scanned, or not counted yet) answers null; zeros are real.',
    },
    list_word_names: {
        use: 'Use it when someone wants every catalog name built on one word; it answers one page at a time.',
    },
    get_word_trademarks: {
        use: 'Use it when someone asks whether a word is a registered trademark before choosing a name.',
    },
    get_word_notability: {
        use: 'Use it when someone asks how widely known a word is as a public topic.',
    },
    get_word_market: {
        summary: "A word's stored sales and auction aggregates.",
        use: 'Use it when someone asks how a word sells across endings: counts, prices and auctions.',
    },
    list_related_words: {
        use: 'Use it when the first word is taken and someone wants close alternatives that still have open names.',
    },
    list_word_fits: {
        use: 'Use it when someone asks which endings suit a word.',
    },
    request_word: {
        use: "Use it when a word is missing from the catalog and should join it; each call counts against the month's word requests.",
    },
    get_word_request: {
        use: 'Use it to follow a word request until its word is ready.',
    },

    /* ---------- Catalog names ---------- */
    list_domains: {
        use: 'Use it when someone wants one-word names matching filters such as ending, length or price. Neutral order, one page at a time.',
    },
    get_domain: {
        summary: 'One catalog name, by name or catalog id.',
        use: 'Use it when someone asks about one catalog name and holds its name or its catalog id.',
    },
    list_expiring_domains: {
        use: 'Use it when someone wants names whose registration is about to run out, by day.',
    },
    get_domain_drops: {
        // Review n10 of 2026-11-11: the document's summary ("Names dropping on one day") titled a tool whose keyless
        // answer is a count by ending and never a name. Worded for both forms: the hosted profile carries no key talk.
        summary: 'The names dropping on one day, counted by ending.',
        use: 'Use it when someone asks how many names drop on a given day, and on which endings.',
    },
    list_domain_hacks: {
        use: 'Use it when someone wants a short name in which the ending spells the last letters of the word.',
    },
    list_domain_changes: {
        summary: "Changes across the catalog's names, newest first.",
        use: 'Use it when following what changed across names since a day; it answers one page at a time.',
    },
    get_catalog_stats: {
        use: 'Use it when someone asks how many names the catalog tracks and how many are open.',
    },

    /* ---------- Endings ---------- */
    list_tlds: {
        use: 'Use it when someone wants to browse endings by type, country or status; it answers one page at a time.',
    },
    get_tld: {
        use: 'Use it when someone asks about one ending: who runs it, its launch phases, its market and its prices.',
    },
    get_tld_stats: {
        use: "Use it when someone asks how one ending's market is doing, such as its registrations or sales over time.",
    },
    list_tld_phases: {
        use: 'Use it when someone asks when an ending opens, such as its sunrise or general availability dates.',
    },
    list_tld_changes: {
        use: "Use it when someone asks what changed at an ending's registry lately.",
    },
    list_tld_keywords: {
        use: 'Use it when someone asks which words or topics an ending suits.',
    },
    list_tld_applications: {
        use: 'Use it when someone asks who applied for new endings in the 2026 round, or which strings are contested.',
    },
    list_tld_application_changes: {
        use: 'Use it when someone asks what moved in the 2026 round lately, such as a withdrawal or a contention change.',
    },
    get_tld_application_string: {
        examples: { string: 'account' },
        use: 'Use it when someone asks about one applied-for ending, such as who applied for it.',
    },

    /* ---------- Registrars and prices ---------- */
    list_registrars: {
        use: 'Use it when someone asks which registrars the price comparisons cover.',
    },
    list_registrar_prices: {
        use: 'Use it when someone asks what one registrar charges for its endings, first year and renewal.',
    },
    list_registrar_changes: {
        use: "Use it when someone asks how one registrar's prices changed lately.",
    },
    get_registrar_footprint: {
        use: 'Use it when someone asks how many names a registrar holds and on which endings.',
    },
    list_tld_prices: {
        use: 'Use it when someone asks where one ending is cheapest to register or to renew.',
    },
    list_tld_price_history: {
        use: "Use it when someone asks how one ending's price moved over time.",
    },
    list_price_changes: {
        use: 'Use it when someone asks which registrar prices changed lately.',
    },
    list_price_traps: {
        use: 'Use it when someone wants to avoid endings that are cheap the first year and costly to renew.',
    },
    list_cheapest_prices: {
        use: 'Use it when comparing where a list of endings is cheapest, all at once.',
    },
    list_venues: {
        use: 'Use it when someone asks which marketplaces or parking services list names, and how many.',
    },
    get_venue: {
        use: "Use it when someone asks about one marketplace's or parking service's terms, such as its commission.",
    },
    list_iana_registrars: {
        summary: 'The IANA registrar list as stored, by IANA id.',
        use: 'Use it when someone asks for accredited registrars beyond the nine compared; it answers one page at a time.',
    },
    get_iana_registrar: {
        use: 'Use it when someone holds an IANA registrar number and asks who it is.',
    },

    /* ---------- The market ---------- */
    get_market_sales: {
        use: 'Use it when someone asks how the domain sales market is doing overall.',
    },
    list_market_sales_series: {
        use: 'Use it when someone wants sales over time, to chart them or compare periods.',
    },
    list_market_sales_endings: {
        use: 'Use it when someone asks which endings sell and at what median price.',
    },
    get_market_sales_lengths: {
        use: 'Use it when someone asks how the length of a name relates to its sale price.',
    },
    list_market_sales_movers: {
        use: 'Use it when someone asks which words are selling more or less lately.',
    },
    get_market_sales_word: {
        use: 'Use it when someone asks how one word has sold over the last year.',
    },
    get_market_auctions: {
        use: "Use it when someone asks about today's auction market as a whole.",
    },
    list_market_auctions_sample: {
        use: 'Use it when someone wants examples of single-word names at auction today. A fixed daily sample, not every auction.',
    },
    list_market_auction_venues: {
        use: 'Use it when someone asks how an auction venue works, or how many auctions it runs today.',
    },
    list_market_auction_outcomes: {
        use: 'Use it when someone asks how auctions end at a venue, such as how many sell and at what median.',
    },

    /* ---------- Trends and editions ---------- */
    list_trends: {
        use: 'Use it when someone looks for rising topics to name a project after; it answers one page at a time.',
    },
    get_trend: {
        examples: { slug: 'ambient-lights' },
        use: 'Use it when someone asks about one trend: how it grew and its key words.',
    },
    list_trend_categories: {
        summary: 'The trend categories, to narrow the trends by.',
        use: 'Use it when someone wants trends from one field only, such as business or health.',
    },
    list_trend_pool: {
        summary: 'The trend candidates the daily editions draw from, with their observations.',
        use: 'Use it when someone wants trends before the editions publish them; it answers one page at a time.',
    },
    get_latest_edition: {
        summary: 'The latest daily edition of Business Ideas or Trending Domains: trends with open names, for founders or for investors.',
        use: "Use it when someone wants today's name ideas from rising topics; it carries the edition's open names only.",
    },
    get_edition: {
        // 2026-11-10: a day the founders' page has an edition of its own (some earlier days answer the investors').
        examples: { persona: 'founder', date: '2026-11-10' },
        summary: 'One dated daily edition of Business Ideas or Trending Domains: founders read the first, investors the second.',
        // The one limit an assistant must know (2026-11-11): a founders' read of 2026-11-05 answered the investors'
        // edition and read as a wrong answer. Days before 2026-11-10 hold one edition, written for investors, and the
        // founders' page reads it with the founder ratings (the API's D21 rule).
        use: "Use it when someone asks about a past day's edition. Before 2026-11-10 a day may hold the investors' edition only, which founders read too: the answer then says `investor`.",
    },

    /* ---------- The agenda ---------- */
    list_events: {
        use: 'Use it when someone asks about domain or internet industry events in a month.',
    },
    get_event: {
        examples: { slug: 'registrar-day-afnic-2027' },
        use: 'Use it when someone asks for the details of one event.',
    },
    get_agenda: {
        use: 'Use it when someone asks what happens in a month: events, ending launches and registry changes.',
    },

    /* ---------- Reference lists ---------- */
    get_meta_enums: {
        summary: 'Every list of values the answers use, such as statuses, venues and bands.',
        // The providers' venue sentence (review R-5 of 2026-11-11): this list leaves out the guarded venue too.
        use: 'Use it when an answer holds a code and someone needs its meaning. An auction answer names its own venue on each row, which may be one this list leaves out.',
    },
    get_meta_freshness: {
        summary: "How current each part of the stored data is, with the day's counts.",
        use: 'Use it when someone asks how fresh the stored data is.',
    },
    list_meta_datasets: {
        summary: 'The free GitHub datasets that hold the same rows as these answers.',
        use: 'Use it when someone wants the data in bulk, as files.',
    },
    list_meta_trademark_classes: {
        use: 'Use it when a trademark answer names a class number and someone needs what it covers.',
    },
    get_meta_providers: {
        // Not "every auction venue" (2026-11-11): one venue is named on the auction answers only (the platform's
        // decision 44, letter 1A), so this list is shorter than the venues an auction row may carry.
        use: 'Use it when someone needs the registrars, auction venues and parking services an answer may name. An auction answer names its own venue on each row, which may be one this list leaves out.',
    },

    /* ---------- The member key ---------- */
    get_key: {
        summary: 'What the calling member key opens: its allowances and its month.',
        use: 'Use it when someone asks how many calls or checks are left this month.',
    },
};

/** The guidance of one operation; a missing entry fails the generation, so no tool ships without one. */
/*----------------------------------
- INPUT DESCRIPTIONS
----------------------------------*/

/**
 * Input descriptions in a tool user's words, in place of the API document's where it speaks the API's language (an
 * HTTP status and problem code, a route, an internal word) or says nothing a caller can use (the directory quality
 * audit of 2026-11-11, Gaetan's 3A). `SHARED_INPUTS` holds an input every tool that takes it reads the same way;
 * `INPUTS` an input of one operation. Like `use`, these reach the server here, not through an SDK release.
 */
export const SHARED_INPUTS = {
    name: 'A full domain name on an ending the catalog holds, such as harbor.io: lowercase, an internationalized name as punycode. A bare word, a subdomain, an email address or an unknown ending is refused with the reason and a suggestion.',
};

/** @type {Readonly<Record<string, Readonly<Record<string, string>>>>} */
export const INPUTS = {
    // The document's `shape` text names a grade, which the hosted connector drops whole, leaving the input bare.
    list_domains: { shape: 'Comma list of word shapes: single, properNoun, acronym, twoWords, phrase. A proper noun is left out of an answer without a key.' },
    list_domain_hacks: { shape: 'Comma list of word shapes: single, properNoun, acronym, twoWords, phrase. A proper noun is left out of an answer without a key.' },
    list_trends: {
        category: 'A trend category slug, as the trend categories list names it.',
        lane: 'How the trend rises: `weekly` for a topic rising now, `yearly` for one rising over the year.',
    },
    list_words: { category: 'A word category slug, as the word categories list names it.' },
};

/** The description an input carries in the tool, or null to keep the API document's. */
export const inputDescriptionOf = (operationId, name) => INPUTS[operationId]?.[name] ?? SHARED_INPUTS[name] ?? null;

export const guidanceOf = (operationId) => {
    const entry = GUIDANCE[operationId];
    if (!entry) throw new Error(`${operationId}: no entry in scripts/lib/guidance.mjs`);
    return entry;
};
