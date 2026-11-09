---
name: unique-domains
description: Answer questions about domain names, words, TLDs, registrar prices, the domain market, trends and the domain industry agenda with the Unique Domains tools.
---

# Unique Domains

Use the Unique Domains tools when someone asks about a domain name, a word as a name, an ending (TLD), a registrar's prices, domain sales or auctions, naming trends or industry events.

- A name: pass the full name with its ending, such as `get.plumbing`, to `ud_get_name` (status and price), `ud_get_name_registry` (registrar and dates) or `ud_get_name_dns`.
- An ending: pass it without the dot, such as `ai`, to `ud_get_tld`, `ud_list_tld_phases` or `ud_get_tld_stats`.
- A registrar: `ud_list_registrars`, then `ud_list_registrar_prices` with its slug.
- The market: `ud_get_market_sales` and `ud_get_market_auctions` answer aggregates.
- A list answers 20 rows by default. When `meta.cursor` is set, pass it as `cursor` to read the next page.

Every answer is stored data as of its day. Give the reader `links.details` when it is set: it is the public page about the subject. The tools read only; they never register or buy a name.
