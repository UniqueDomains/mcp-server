#!/usr/bin/env node
/*----------------------------------
- STDIO TRANSPORT
----------------------------------*/

/**
 * `npx @uniquedomains/mcp-server`: the local profile by default, one server for the process. Logs go to stderr, since
 * stdout carries the protocol.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { ConfigError, readConfig } from '../config';
import { createMcpServer, prepareServer, SERVER_VERSION } from '../server';

const log = (line: string): void => {
    process.stderr.write(`[uniquedomains-mcp-server] ${line}\n`);
};

const main = async (): Promise<void> => {
    if (process.argv.includes('--version')) {
        process.stdout.write(`${SERVER_VERSION}\n`);
        return;
    }
    const config = readConfig(process.env);
    const prepared = await prepareServer(config, { log });
    const server = createMcpServer(prepared);
    await server.connect(new StdioServerTransport());
    log(`${SERVER_VERSION} ready: ${prepared.tools.length} tools, ${config.profile} profile${prepared.plan !== 'none' ? `, ${prepared.plan} key` : ''}.`);
};

main().catch((error: unknown) => {
    log(error instanceof ConfigError ? error.message : error instanceof Error ? (error.stack ?? error.message) : String(error));
    process.exit(1);
});
