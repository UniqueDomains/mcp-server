# Unique.domains MCP server

Without a tool, an assistant can only guess whether a domain name is taken. This server gives it the record: 34 million one-word names on 505 endings (TLDs), read every day, each with its dates.

- Hosted, nothing to install, no key: `https://mcp.unique.domains/mcp` (51 tools)
- On your machine: `npx -y @uniquedomains/mcp-server` (56 tools without a key)

One question, one tool call. "Is get.plumbing taken?" on 2026-11-11:

```json
{
  "name": "get.plumbing",
  "status": "for_sale",
  "registry": {
    "createdAt": "2020-06-03",
    "expiresAt": "2027-06-03",
    "registrar": { "name": "GoDaddy.com, LLC", "ianaId": 146 }
  },
  "comps": { "count": 10, "medianUsd": 2677 }
}
```

What the tools read:

- **A name:** [status, price today](https://unique.domains/availability), drop day, [the registry record a WHOIS lookup shows](https://unique.domains/whois), DNS, similar sales and its open auction.
- **A word:** the endings it is still open on. Each word exists once on each ending.
- **An ending:** [registry facts, launch phases, market figures](https://unique.domains/tld), and [ICANN's 2026 new gTLD applications](https://unique.domains/tld/applications).
- **Registrar prices:** [nine registrars' lists](https://unique.domains/registrars), read daily, with each confirmed change and over 300 renewal traps (.agency: $3.50 the first year, $28.04 a year after, on 2026-11-11).
- **The market:** [over 200,000 auctions closing a day](https://unique.domains/auctions) across seven venues, and [12 months of sales](https://unique.domains/sales) as totals.
- **Trends and the agenda:** the naming trends of two daily editions, [Trending Domains](https://unique.domains/trending-domains) and [Business Ideas](https://unique.domains/business-ideas), and [the month's launch dates](https://unique.domains/agenda).

No tool here registers, buys or changes a name. An answer carries its day where the record has one, so your assistant can say how fresh it is.

Three questions to try:

- What is the registry record of get.plumbing?
- What are the newest registrar price changes?
- What is on the domain industry agenda this month?

## Connect your assistant

### Claude

In Claude (web or Desktop), open Customize, then Connectors, click "+ Add", then "Add custom connector", name it Unique Domains and paste `https://mcp.unique.domains/mcp`. No sign-in is needed. On a Team or Enterprise plan, an Owner adds it in Organization settings, then Connectors, and members connect it from Customize, then Connectors.

To run it on your machine instead, add this to Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "uniquedomains": { "command": "npx", "args": ["-y", "@uniquedomains/mcp-server"] }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http uniquedomains https://mcp.unique.domains/mcp
```

Or on your machine, with a member key:

```bash
claude mcp add uniquedomains -e UD_API_KEY=ud_live_your_key -- npx -y @uniquedomains/mcp-server
```

### Cursor

[Add to Cursor](https://cursor.com/en/install-mcp?name=uniquedomains&config=eyJ1cmwiOiJodHRwczovL21jcC51bmlxdWUuZG9tYWlucy9tY3AifQ==) (the direct link is `cursor://anysphere.cursor-deeplink/mcp/install?name=uniquedomains&config=eyJ1cmwiOiJodHRwczovL21jcC51bmlxdWUuZG9tYWlucy9tY3AifQ==`), or put this in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "uniquedomains": { "url": "https://mcp.unique.domains/mcp" }
  }
}
```

### VS Code

```bash
code --add-mcp '{"name":"uniquedomains","type":"http","url":"https://mcp.unique.domains/mcp"}'
```

Or in `.vscode/mcp.json`:

```json
{
  "servers": {
    "uniquedomains": { "type": "http", "url": "https://mcp.unique.domains/mcp" }
  }
}
```

### ChatGPT

Go to [chatgpt.com/plugins](https://chatgpt.com/plugins), select the plus button, then "Add custom MCP server". Name it Unique Domains, enter `https://mcp.unique.domains/mcp` as the server URL with no authentication, then "Create as a plugin". Install the plugin, then in a new conversation type `@` and pick it. Your account's or workspace's policies decide whether custom servers can be added.

### Any other client

Streamable HTTP at `https://mcp.unique.domains/mcp`, or stdio with `npx -y @uniquedomains/mcp-server`.

## Plugins

The [`plugin/`](plugin) folder is a plugin for the AI assistants that take one. It holds the hosted connector and one skill, which tells the assistant which tool answers which question. It runs nothing on your machine and uses no key.

In Claude Code, run this line:

```
/plugin install unique-domains --marketplace UniqueDomains/mcp-server
```

Claude Code asks you to confirm this repository as a marketplace, then opens the plugin's page, where you install it. The line needs Claude Code 2.1.275 or later. On an earlier version, do the same in two steps:

```
/plugin marketplace add UniqueDomains/mcp-server
/plugin install unique-domains@uniquedomains
```

Three other tools read files of this repository. Grok Build reads `plugin/.grok-plugin/plugin.json`, in the same folder. Gemini CLI reads `gemini-extension.json` at the root, which adds the hosted connector and loads `GEMINI.md`, the skill's guidance, as its context file. For Devin, `npm run plugin:devin` builds the folder its marketplace takes.

## Free tools and a member key

Without a key, the server answers what the Unique Domains website shows anyone: a name's status and registry record, an ending's facts, registrar prices, market aggregates, trends and the agenda.

A member key adds the keyed tools of its plan, the Founder or the Investor plan. Create the key in Unique Domains under Settings, Account, API, then pass it to the server on your machine:

```bash
UD_API_KEY=ud_live_your_key npx -y @uniquedomains/mcp-server
```

The server reads the key's plan once at start and lists the tools that plan opens. The plans are described at [unique.domains/api](https://unique.domains/api).

The hosted connector serves the free tools only and takes no key. Five free tools are on the npm server only. Three answer one word or one ending a caller a day, and the hosted connector is one caller for all its users: `ud_get_market_sales_word`, `ud_get_word_market`, `ud_list_tld_prices`. `ud_get_domain` answers what `ud_get_name` answers, and `ud_get_meta_freshness` reports how current each part of the data is, which every answer's `meta` already dates.

## What an answer holds

- `structuredContent`: the API's `data`, `meta` and `links`, as the tool's output schema describes them.
- `content`: one line for a reader (the name and its headline fact, or the row count and the first names), then the same JSON as text.
- `links.details`: the public Unique Domains page about the subject, when there is one (hosted connector).
- On the hosted connector, internal ids (catalog ids, row ids, UUIDs) are left out, times become their UTC day (an auction's deadline keeps its hour), and the stamps of when a figure was computed are dropped. The npm server and the API keep them.
- A list answers 20 rows by default. When `meta.cursor` is set, pass it as `cursor` to read the next page.
- A refusal is a sentence the assistant can act on: what was wrong, what is accepted, or when a limit resets.

## Privacy and security

- **What the connector logs.** It passes each tool's input to the Unique Domains API, and the API's request log keeps one line per call for 12 months: the path, which holds the name or word asked about, with its time, its status and how long it took. A monthly job deletes older lines. The connector calls the API under its own name, so the API never sees your address or an account of yours. When your assistant runs on your own machine, it connects to the connector from your IP address. The connector's hosting providers see it, as they see the address behind any web request, and the connector does not store it. Section 8 of the [privacy policy](https://unique.domains/privacy#api-and-connector) says what the API keeps and why.
- **Registry records.** A name's registry answer repeats the registry's public record, which can include the holder's name or organization when the registry publishes it.
- **Every origin is accepted.** `/mcp` answers any `Origin` with `Access-Control-Allow-Origin: *`. The server is public, needs no sign-in, holds no session and never serves a member key over HTTP, so checking the origin would protect nothing, and strict origin checks break some assistants' own clients.
- **HTTPS only.** The hosted connector answers over HTTPS and sends `Strict-Transport-Security: max-age=31536000`.
- **Reporting a vulnerability.** Write to [contact@unique.domains](mailto:contact@unique.domains); please do not open a public issue for it.

## The same data elsewhere

- The API reference: [unique.domains/api](https://unique.domains/api)
- The SDK and the command line: [UniqueDomains/nodejs](https://github.com/UniqueDomains/nodejs) (`@uniquedomains/sdk`, `@uniquedomains/cli`)
- The open datasets on GitHub: [one-word domains](https://github.com/uniquedomains/oneword-domains), [expiring one-word domains](https://github.com/uniquedomains/expiring-oneword-domains), [the daily editions](https://github.com/uniquedomains/trending-domains-business-ideas), [the 2026 new gTLD applications](https://github.com/uniquedomains/new-gtld-applications-2026) and [the rest of the organization](https://github.com/uniquedomains)

## Tools

<!-- tools:start (generated by scripts/generate.mjs) -->

56 tools answer without a key (51 on the hosted connector); a member key adds 25 more, the Investor ones for an Investor key only.

| Tool | What it reads | Needs |
|---|---|---|
| `ud_get_name` | Stored answer for one domain name | free |
| `ud_batch_names` | Stored answers for up to 100 domain names in one call | Investor key |
| `ud_check_name` | Reads one name live from its registry and a registrar | member key |
| `ud_get_name_prices` | Every stored registrar quote for one name | member key |
| `ud_get_name_registry` | Latest stored registry record of one name | free |
| `ud_get_name_registry_history` | Stored registry record versions of one name and what moved between them | Investor key |
| `ud_get_name_dns` | Latest stored DNS reading of one name | free |
| `ud_list_name_changes` | Change events of one name, newest first | Investor key |
| `ud_get_name_history` | Web history of one name in bands | Investor key |
| `ud_get_name_value` | Stored value estimate of one name and its last 20 estimates | member key |
| `ud_appraise_name` | Runs the appraisal of one stored name when its estimate is missing | Investor key |
| `ud_get_name_comps` | Similar-sales aggregate of one name and how many endings its word sold on | free |
| `ud_get_name_auction` | Open auction of one name, if any | free |
| `ud_resolve_word` | Turns what a caller typed into the catalog word it names | free |
| `ud_list_word_categories` | Catalog's word categories, by name | free |
| `ud_batch_words` | Up to 100 word profiles in one call | Investor key |
| `ud_list_words` | Searches the catalog's words by text and facets | member key |
| `ud_get_word` | A word's profile | member key |
| `ud_get_word_endings` | A word's endings as stored on the latest day | free |
| `ud_list_word_names` | A word's catalog names on the endings that sell, by name | member key |
| `ud_get_word_trademarks` | A word's trademark counts and its exact-match marks | Investor key |
| `ud_get_word_notability` | A word's Wikipedia and Wikidata facts | free |
| `ud_get_word_market` | A word's stored sales and auction aggregates | free, npm only |
| `ud_list_related_words` | A word's synonyms then related words | Investor key |
| `ud_list_word_fits` | How well the word fits each ending whose keywords list it | Investor key |
| `ud_request_word` | Brings a word into the catalog | Investor key |
| `ud_get_word_request` | State of a word request | Investor key |
| `ud_list_domains` | One-word catalog names under filters | free |
| `ud_get_domain` | One catalog name, by name or catalog id | free, npm only |
| `ud_list_expiring_domains` | Catalog names expiring or expired, by expiry day | Investor key |
| `ud_get_domain_drops` | Names dropping on one day, counted by ending | free |
| `ud_list_domain_hacks` | Domain hacks | free |
| `ud_list_domain_changes` | Changes across the catalog's names, newest first | Investor key |
| `ud_get_catalog_stats` | Catalog headline totals for the latest day | free |
| `ud_list_tlds` | Every root TLD with its registry facts and launch phases | free |
| `ud_get_tld` | One TLD in full | free |
| `ud_get_tld_stats` | Ending's latest market figures | free |
| `ud_list_tld_phases` | Every dated launch phase of the ending, chronological | free |
| `ud_list_tld_changes` | Ending's public registry changes, newest first | free |
| `ud_list_tld_keywords` | Keywords the catalog attaches to the ending, by type | free |
| `ud_list_tld_applications` | 2026 new gTLD round as ICANN publishes it | free |
| `ud_list_tld_application_changes` | Every recorded status or contention change of the round | free |
| `ud_get_tld_application_string` | One applied-for string | free |
| `ud_list_registrars` | Nine registrars whose daily price lists are compared | free |
| `ud_list_registrar_prices` | A registrar's list prices, alphabetical by ending | free |
| `ud_list_registrar_changes` | A registrar's confirmed list-price changes, newest first | free |
| `ud_get_registrar_footprint` | Names tracked under the registrar on the latest footprint day | member key |
| `ud_list_tld_prices` | Every registrar's list price for one ending | free, npm only |
| `ud_list_tld_price_history` | Change-only price rows of one ending, newest first | Investor key |
| `ud_list_price_changes` | Confirmed registrar price changes across the nine | free |
| `ud_list_price_traps` | Endings whose cheapest first year renews at a trap price | free |
| `ud_list_cheapest_prices` | Cheapest registrar per ending for up to 100 endings | member key |
| `ud_list_venues` | Parking and marketplace venues with a profile and their rounded footprint | free |
| `ud_get_venue` | One venue's profile with its verified listing terms | free |
| `ud_list_iana_registrars` | IANA registrar list as stored, by IANA id | free |
| `ud_get_iana_registrar` | One IANA registrar by id | free |
| `ud_get_market_sales` | Domain sales pulse as headline aggregates | free |
| `ud_list_market_sales_series` | One sales series by day, week or month, oldest first | free |
| `ud_list_market_sales_endings` | Each ending's 12-month and 30-day sales figures | free |
| `ud_get_market_sales_lengths` | Sales by label length for .com, .ai, .io and .co | free |
| `ud_list_market_sales_movers` | Up to ten words whose sales moved over the last 30 days | free |
| `ud_get_market_sales_word` | One word's sales market over 12 months | free, npm only |
| `ud_get_market_auctions` | Today's domain auctions by venue | free |
| `ud_list_market_auctions_sample` | Day's fixed sample of up to 20 single-word names at auction | free |
| `ud_list_market_auction_venues` | Seven auction venues with their verified rules and today's counts | free |
| `ud_list_market_auction_outcomes` | Confirmed auction outcomes by venue | Investor key |
| `ud_list_trends` | Every published trend with its latest edition figures and its first and last edition day | free |
| `ud_get_trend` | One trend | free |
| `ud_list_trend_categories` | Trend categories, to narrow the trends by | free |
| `ud_list_trend_pool` | Trend candidates the daily editions draw from | member key |
| `ud_list_events` | Industry events of one month | free |
| `ud_get_event` | One industry event with its organizer | free |
| `ud_get_agenda` | Whole public agenda of one month | free |
| `ud_get_latest_edition` | Latest daily edition of Business Ideas or Trending Domains | free |
| `ud_get_edition` | One dated daily edition of Business Ideas or Trending Domains | free |
| `ud_get_meta_enums` | Every list of values the answers use | free |
| `ud_get_meta_freshness` | How current each part of the stored data is | free, npm only |
| `ud_list_meta_datasets` | Free GitHub datasets that hold the same rows as these answers | free |
| `ud_list_meta_trademark_classes` | 45 Nice classes a trademark is filed under | free |
| `ud_get_meta_providers` | Registrar identities and the auction venue and parking service catalogs | free |
| `ud_get_key` | What the calling member key opens | member key |

<!-- tools:end -->

## Settings

| Variable | Profile | What it does |
|---|---|---|
| `UD_API_KEY` | local | A member key: adds the keyed tools of its plan. |
| `UD_MCP_PROFILE` | both | `local` (the default) or `hosted`. |
| `UD_API_BASE` | both | Another API base, for a local run of the API. |
| `UD_CONNECTOR_SECRET` | hosted | The connector's shared secret, sent as `X-UD-Connector-Secret`. |
| `UD_WELLKNOWN_FILES` | hosted | Files served under `/.well-known/`, as a JSON object (see below). |
| `PORT` | hosted | The HTTP port, 8080 by default. |

The hosted profile registers the free tools only, sends no `Authorization` header whatever `UD_API_KEY` holds, removes the `register` and `product` links from answers and adds `links.details`. Without a key (the hosted profile, or the npm server with no `UD_API_KEY`), the inputs only a key may send, such as `sort` or `prefix`, are not listed.

`UD_WELLKNOWN_FILES` maps a file name to its body (served as plain text) or to `{ "body": "...", "contentType": "..." }`, so a directory's proof takes a variable change and no deploy:

```json
{
  "openai-apps-challenge": "<the token from OpenAI's portal>",
  "mcp-registry-auth": "v=MCPv1; k=ed25519; p=<public key>",
  "glama.json": { "body": "{\"$schema\":\"https://glama.ai/mcp/schemas/connector.json\",\"claim\":\"<token>\"}", "contentType": "application/json" }
}
```

## Run the hosted connector yourself

```bash
docker build -t uniquedomains-mcp-server .
docker run -p 8080:8080 uniquedomains-mcp-server
```

The image runs `node dist/http.js` with `UD_MCP_PROFILE=hosted`: `POST /mcp` (stateless Streamable HTTP, plain JSON answers), `GET /healthz`, and the well-known files. Every answer is `Cache-Control: no-store` with `Strict-Transport-Security: max-age=31536000`, and `/mcp` allows any origin (its preflight offers `POST` and `OPTIONS`).

The same image speaks stdio when given the stdio entry, for catalogs that inspect a server that way:

```bash
docker run -i --rm -e UD_MCP_PROFILE=local uniquedomains-mcp-server dist/stdio.js
```

## Development

```bash
npm ci
npm run build
npm test
npm run smoke
```

- `npm run generate` rebuilds `src/generated/tools.ts`, `openapi/v1.json` and the tool list above from the API document that `@uniquedomains/sdk` ships; `-- --check` fails when they are out of date, `-- --live` compares the live document.
- `npm run smoke` runs the MCP Inspector against both transports and a fixture API; `-- --live` uses the live API.
- `npm run plugin` builds `dist/chatgpt-plugin.zip` from `directories/openai/review.json` (the review texts, the test cases, the release notes) and checks it against OpenAI's limits and categories; `npm run plugin:test` also builds a sheet marked as a placeholder.
- `npm run plugin:devin` builds `dist/devin/plugins/unique-domains/` (the manifest Devin's validator accepts, a 256 px logo and a copy of the skill) for a pull request to Devin's marketplace.
- The nightly contract workflow opens its pull request with the workflow token, which needs the repository setting "Allow GitHub Actions to create and approve pull requests" (Settings, Actions, General).

## License

MIT
