# Unique Domains plugin

Unique Domains keeps a daily record of domain names and the endings they sit on. This plugin lets your assistant read that record, so you can ask about a name, a word, an ending or a registrar in plain words and get stored facts back.

It holds two things: the Unique Domains connector (`https://mcp.unique.domains/mcp`, hosted, nothing to install, no account and no sign-in) and one skill that tells the assistant which tool answers which question.

## Add it

In Claude Code:

```
/plugin install unique-domains --marketplace UniqueDomains/mcp-server
```

On Claude Code before 2.1.275, add the marketplace first, then the plugin:

```
/plugin marketplace add UniqueDomains/mcp-server
/plugin install unique-domains@uniquedomains
```

## What it can look up

- A domain name: its status, drop day and price today, its latest registry record (registrar, dates, status codes, nameservers), its DNS reading, how the same word sold on other endings (a count and a median), and its open auction if there is one.
- A word: the catalog word behind what you typed, its endings and open names, and its Wikipedia and Wikidata facts.
- An ending (TLD): registry facts, dated launch phases, market figures, registry changes, and the 2026 new gTLD applications as ICANN publishes them.
- Registrars: the daily list prices of nine registrars, their confirmed price changes, and the endings whose renewal costs far more than the first year.
- The market: domain sales and today's auctions as totals by ending, length and auction site, and a daily sample of single-word names at auction.
- Trends and the agenda: naming trends with their daily editions, and the industry events and launch dates of a month.

Every answer is stored data, dated where the record has a day. The tools only read: none registers, buys or changes a name.

## Try it

- What is the registry record of get.plumbing?
- What are the newest registrar price changes?
- What is on the domain industry agenda this month?

## What it runs, sends and keeps

The plugin runs nothing on your machine and reads none of your files. When the assistant calls a tool, the tool's input (a name, a word, an ending, a month) goes to `https://mcp.unique.domains/mcp`, which passes it to the Unique Domains API at `https://api.unique.domains`. No other host is called and no credential is used.

The connector stores no question, no answer and no caller. The API's request log keeps one line per call (the path, which holds the name or word asked about, its time, its status and how long it took) for 12 months, after which a monthly job deletes it. The connector's calls carry no address or account of yours. When your assistant runs on your own machine, it reaches the connector from your IP address, which the connector's hosting providers see like any other web request. Section 8 of the [privacy policy](https://unique.domains/privacy#api-and-connector) says what the API keeps and why.

A name's registry answer repeats the registry's public record, which can include the holder's name or organization when the registry publishes it.

Documentation: https://unique.domains/api/mcp. Help: https://unique.domains/api#faq. Licence: MIT.
