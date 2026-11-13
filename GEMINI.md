# Unique.domains

The Unique.domains tools (their names start with `ud_`) read a catalog that is updated every day. The tools only read: none registers, buys, renews or changes a name.

## Which tool answers what

One domain name. Pass the full name with its ending, such as `get.plumbing`.

- Is it open, taken or for sale, its price today when the record has one, when it drops: `ud_get_name`. Its `status` groups a list row's status for a buyer: a row's `resell` reads `for_sale` here (`at_auction` at a drop-catch venue), and `premium` reads `free_premium`
- Its registrar, when it was registered, when it expires, and its holder when the registry publishes one: `ud_get_name_registry`
- Whether it points anywhere or is parked: `ud_get_name_dns`
- What similar names sold for, as a count and a median, and on how many endings its word sold: `ud_get_name_comps`. Its `tier` says how close those sales are, from the same word to the wider market
- Whether it is at auction now: `ud_get_name_auction`

A word as a name.

- Start with `ud_resolve_word` when the word is misspelled, plural or unclear, and use the word it answers.
- How many of its names are open, taken or for sale, by ending: `ud_get_word_endings`. A word with no count yet answers null; zeros are real: a counted word with zeros has no open name. For one ending, ask `ud_get_name` with the full name
- How widely known it is: `ud_get_word_notability`
- The word categories: `ud_list_word_categories`

Names from the catalog.

- One-word names by ending, length or price: `ud_list_domains` (endings without the dot, such as `ai,io`)
- Names in which the ending spells the end of the word: `ud_list_domain_hacks`
- How many names drop on a day, and on which endings, for today or one of the next 6 days: `ud_get_domain_drops`
- How many names the catalog tracks: `ud_get_catalog_stats`

An ending (TLD). Pass it without the dot, such as `ai`.

- Browse the endings: `ud_list_tlds`
- One ending's registry, launch phases, market and prices: `ud_get_tld`
- Its launch dates: `ud_list_tld_phases`
- Its market figures today, and day by day with `history`: `ud_get_tld_stats`
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
- IANA's list of registrars, by IANA number: `ud_list_iana_registrars`, then `ud_get_iana_registrar`

The market, as totals.

- Domain sales overall: `ud_get_market_sales`
- Sales over time: `ud_list_market_sales_series`
- Sales by ending: `ud_list_market_sales_endings`
- Sales by length of name, on .com, .ai, .io and .co: `ud_get_market_sales_lengths`
- Words selling more or less lately: `ud_list_market_sales_movers`
- Today's auctions as a whole: `ud_get_market_auctions`
- Examples of single-word names at auction today: `ud_list_market_auctions_sample`
- How each auction venue works: `ud_list_market_auction_venues`

Trends and name ideas.

- Trends with their searches and growth: `ud_list_trends`. Narrow it with `category`, a slug taken from `ud_list_trend_categories`
- One trend: `ud_get_trend` with a slug taken from the list
- The latest edition's name ideas from trends: `ud_get_latest_edition` with `founder` (Business Ideas) or `investor` (Trending Domains). Say the edition's date. `trendCount` counts the whole edition, while `trends` lists at most 20, the ones the public page shows
- A past day's edition: `ud_get_edition`

The industry agenda. Pass a month as `YYYY-MM`.

- Events and ending launches of a month, with the latest registry changes: `ud_get_agenda`
- Events only: `ud_list_events`, then `ud_get_event` with a slug taken from the list

Reference lists.

- Which values a field can take, such as a status or a lifecycle: `ud_get_meta_enums`
- The compared registrars, the auction venues and the parking services, by id and label: `ud_get_meta_providers`
- What a trademark class number covers: `ud_list_meta_trademark_classes`
- The free datasets on GitHub, as files: `ud_list_meta_datasets`

## How to answer

- Say the day the data is from when the answer carries one.
- Give the reader `links.details` when it is set: it is the public page about the subject, or about its section, on unique.domains.
- Keep a list in the order the tool returns it, and do not present the first rows as better than the rest.
- A list that pages answers up to 20 rows at a time. When `meta.cursor` in the answer is set, pass it as `cursor` for the next page. When it is null, there is no next page. A list with no `cursor` input answers once.
- No next page does not always mean the whole list. Some tools answer a fixed cut of a longer one: `ud_list_domains` and `ud_list_domain_hacks` give at most 20 names, even when many more match; `ud_list_price_changes` and `ud_list_registrar_changes` give the newest changes only; `ud_list_price_traps` gives a few rows, with the full count in `meta.trapCount`; `ud_list_registrar_prices` gives that day's set of endings, not every ending the registrar sells. Present a cut as a cut: say "here are 20 of them", never "these are all of them", and never conclude that something does not exist because a cut leaves it out.
- A sample is a sample: the auction examples are a fixed set for the day, and the sales tools answer totals, not single sales.
- A name outside the catalog answers the status `not_checked`. Say that the catalog has no answer for it and that the name may well be taken, never that it is free.
- Take a slug, a registrar or an applied-for string from the matching list tool. Do not guess it.
- When a tool answers a problem, such as a word with no ending, an ending outside the catalog or a limit reached, say what it said in plain words and do not call it again in a loop.
- When someone asks to register, buy, renew or point a name: say these tools cannot do it and that a registrar does, then offer the facts the tools can read.
