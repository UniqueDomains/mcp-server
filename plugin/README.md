# Unique Domains plugin

Unique Domains keeps a daily record of domain names and of the endings they sit on, such as .com or .app. This plugin lets your assistant read that record. Ask about a name, a word, an ending or a registrar in plain words, and you get stored facts back.

The plugin holds two things. The first is the Unique Domains connector, hosted at `https://mcp.unique.domains/mcp`: there is nothing to install for it, and it asks for no account and no sign-in. The second is one skill, which tells the assistant which tool answers which question.

## Add it

In Claude Code, run this line:

```
/plugin install unique-domains --marketplace UniqueDomains/mcp-server
```

Claude Code asks you to confirm this repository as a marketplace, then opens the plugin's page, where you install it. The line needs Claude Code 2.1.275 or later. On an earlier version, do the same in two steps:

```
/plugin marketplace add UniqueDomains/mcp-server
/plugin install unique-domains@uniquedomains
```

There is nothing to set up afterwards. Ask one of the questions under "Try it" and the assistant answers from the record.

## What you can ask about

- A domain name: its status, what it costs to register when it is open, and its drop day, the day an expired name can be registered again. Its latest registry record, the one a WHOIS lookup shows: registrar, dates, status codes and nameservers. Its DNS reading, what similar names sold for (a count and a median), and its open auction if there is one.
- A word: the catalog word behind what you typed, a count of its names by ending where the catalog has one, and its Wikipedia and Wikidata facts.
- An ending (TLD): its registry facts, its dated launch phases, its market figures and its registry changes. Also the 2026 new gTLD applications, as ICANN publishes them.
- Registrars: what one ending costs at each of the nine registrars that sell it, each registrar's list prices for a set of endings that changes every day, the newest confirmed price changes, and examples of endings whose renewal costs far more than the first year.
- The market: domain sales and today's auctions as totals by ending, by length and by auction site, plus a daily sample of single-word names at auction.
- Trends and the agenda: naming trends with their dated editions, and the industry events and launch dates of a month.

Every answer is stored data, and it carries its day where the record has one. Most answers also link to the public page about the subject on unique.domains.

The tools only read. None registers, buys or changes a name.

## Try it

- What is the registry record of get.plumbing?
- What are the newest registrar price changes?
- What is on the domain industry agenda this month?

## What it runs, sends and keeps

The plugin runs nothing on your machine and reads none of your files. When the assistant calls a tool, the tool's input (such as a name, a word, an ending or a month) goes to `https://mcp.unique.domains/mcp`, which passes it to the Unique Domains API at `https://api.unique.domains`. No other host is called and no credential of yours is used.

The connector keeps no record of the calls it passes on: no question, no answer and no caller. It calls the API under its own name, so the API sees the connector, never your address or an account of yours.

The API's request log keeps one line per call for 12 months. The line holds the path, which includes the name or word asked about, with its time, its status and how long it took. For a refused call, it also holds the refusal's message, which can repeat a value that was sent. Once a month, the lines older than 12 months are deleted.

One address does reach the connector: the one your assistant connects from. When the assistant runs on your own machine, as Claude Code and Cursor do, that is your IP address. The connector's hosting providers see it, as they see the address behind any web request, and can keep it in their own logs. The connector itself does not store it.

A name's registry answer repeats the registry's public record, which can include the holder's name or organization when the registry publishes it.

Section 8 of the [privacy policy](https://unique.domains/privacy#api-and-connector) says what is kept and why.

Documentation: https://unique.domains/api/mcp. Help: https://unique.domains/api#faq. Licence: MIT.
