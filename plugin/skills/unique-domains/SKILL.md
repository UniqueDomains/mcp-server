---
name: unique-domains
description: Look up stored facts about domain names with the Unique Domains tools. Covers a name's status, price, registry record and DNS, the endings open for a word, TLD facts and launch dates, registrar prices, domain sales and auction totals, naming trends and the domain industry agenda. Use it when someone asks about a domain name, a word as a name, an ending (TLD), a registrar's prices or the domain market.
---

# Unique Domains

The Unique Domains tools (their names start with `ud_`) read a catalog that is updated every day. Every answer is stored data as of its day, not a live reading. The tools only read: none registers, buys, renews or changes a name.

## Which tool answers what

One domain name. Pass the full name with its ending, such as `get.plumbing`.

- Is it open or for sale, what it costs, when it drops: `ud_get_name`
- Who holds it, when it was registered, when it expires: `ud_get_name_registry`
- Whether it points anywhere or is parked: `ud_get_name_dns`
- How the same word sold on other endings: `ud_get_name_comps`
- Whether it is at auction now: `ud_get_name_auction`

A word as a name.

- Start with `ud_resolve_word` when the word is misspelled, plural or unclear, and use the word it answers.
- Which endings are still open for it: `ud_get_word_endings`
- How widely known it is: `ud_get_word_notability`
- The word categories: `ud_list_word_categories`

Names from the catalog.

- One-word names by ending, length or price: `ud_list_domains` (endings without the dot, such as `ai,io`)
- Names in which the ending spells the end of the word: `ud_list_domain_hacks`
- How many names drop on a day, and on which endings: `ud_get_domain_drops`
- How many names the catalog tracks: `ud_get_catalog_stats`

An ending (TLD). Pass it without the dot, such as `ai`.

- Browse the endings: `ud_list_tlds`
- One ending's registry, launch phases, market and prices: `ud_get_tld`
- Its launch dates: `ud_list_tld_phases`
- Its market over time: `ud_get_tld_stats`
- What changed at its registry: `ud_list_tld_changes`
- Which words and topics it suits: `ud_list_tld_keywords`
- The 2026 round of new endings: `ud_list_tld_applications` and `ud_list_tld_application_changes`; for one applied-for ending, `ud_get_tld_application_string` with a string taken from the list

Registrars and prices.

- The nine registrars compared: `ud_list_registrars`
- What one of them charges: `ud_list_registrar_prices` with its slug from that list
- How its prices changed: `ud_list_registrar_changes`
- Which prices changed lately, across registrars: `ud_list_price_changes`
- Endings that are cheap the first year and costly to renew: `ud_list_price_traps`
- Marketplaces and parking services: `ud_list_venues`, then `ud_get_venue`
- Accredited registrars by IANA number: `ud_list_iana_registrars`, then `ud_get_iana_registrar`

The market, as totals.

- Domain sales overall: `ud_get_market_sales`
- Sales over time: `ud_list_market_sales_series`
- Sales by ending: `ud_list_market_sales_endings`
- Sales by length of name: `ud_get_market_sales_lengths`
- Words selling more or less lately: `ud_list_market_sales_movers`
- Today's auctions as a whole: `ud_get_market_auctions`
- Examples of single-word names at auction today: `ud_list_market_auctions_sample`
- How each auction venue works: `ud_list_market_auction_venues`

Trends and name ideas.

- Rising topics: `ud_list_trends`, narrowed with `ud_list_trend_categories`
- One trend: `ud_get_trend` with a slug taken from the list
- Today's name ideas from rising topics: `ud_get_latest_edition` with `founder` (Business Ideas) or `investor` (Trending Domains)
- A past day's edition: `ud_get_edition`

The industry agenda. Pass a month as `YYYY-MM`.

- Events, ending launches and registry changes of a month: `ud_get_agenda`
- Events only: `ud_list_events`, then `ud_get_event` with a slug taken from the list

Reference lists.

- What a code in an answer means: `ud_get_meta_enums`
- Every registrar, auction venue and parking service an answer may name: `ud_get_meta_providers`
- What a trademark class number covers: `ud_list_meta_trademark_classes`
- The same data in bulk, as files: `ud_list_meta_datasets`

## How to answer

- Say the day the data is from when the answer carries one, and never present it as checked live.
- Give the reader `links.details` when it is set: it is the public page about the subject on unique.domains.
- Keep a list in the order the tool returns it. The order is neutral: do not present it as best first.
- A list that takes a `cursor` answers one page of up to 20 rows. When the answer carries `meta.cursor`, pass it as `cursor` for the next page; when it does not, that page is the last. A list without a `cursor` input answers all its rows at once.
- A sample is a sample: the auction examples are a fixed set for the day, and the sales tools answer totals, not single sales.
- Take a slug, a registrar or an applied-for string from the matching list tool. Do not guess it.
- When a tool answers a problem, such as an unknown name or a limit reached, say what it said in plain words and do not call it again in a loop.
- When someone asks to register, buy, renew or point a name: say these tools cannot do it and that a registrar does, then offer the facts the tools can read.
