/*----------------------------------
- THE MCP SERVER
----------------------------------*/

/**
 * Builds the API client and the tool list once (`prepareServer`), then one MCP `Server` per connection
 * (`createMcpServer`): stdio makes one for the process, the stateless HTTP transport one per request.
 *
 * With a member key (local profile) the server calls `get_key` once at start and registers the keyed tools of the
 * key's plan: the Founder set, or every keyed tool for an Investor key (member keys plan, section 6). The two free
 * Investor tools are free, so every profile has them, except the hosted one where `get_word_market` sits behind a
 * one-a-day gate (P1-D2).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { ApiProblemError, createClient, type UniqueDomainsClient } from '@uniquedomains/sdk';

import packageJson from '../package.json';
import { runTool, type CallContext } from './call';
import { ConfigError, type Profile, type ServerConfig } from './config';
import { KEY_BOOT_TIMEOUT_MS } from './limits';
import { TOOLS } from './generated/tools';
import { isObject } from './json';
import { inputSchemaFor, isKeyless, outputSchemaFor, selectTools, type KeyPlan } from './profile';
import type { ToolDefinition } from './tool';

export const SERVER_NAME = 'uniquedomains';
export const SERVER_VERSION: string = packageJson.version;

/**
 * The short guide a client may show the assistant (MCP `instructions`). The hosted connector has no tool that reads
 * live, so its guide does not mention one (fix round A6); a member key on npm may open `ud_check_name`, which does.
 */
export const instructionsFor = (profile: Profile): string =>
    [
        'Unique Domains reads its own catalog of domain names, words, TLDs, registrar prices, the domain market, trends and the industry agenda.',
        `Answers are stored data as of their day${profile === 'local' ? ', unless a tool says it reads live' : ''}; \`links.details\` points at the public page about the subject when there is one.`,
        'Pass a full domain name such as get.plumbing to the name tools, and an ending without its dot such as ai to the TLD tools.',
    ].join(' ');

/** The npm server's guide (the local profile). */
export const INSTRUCTIONS = instructionsFor('local');

export type Logger = (line: string) => void;

export type PreparedServer = {
    readonly config: ServerConfig;
    readonly client: UniqueDomainsClient;
    readonly plan: KeyPlan;
    readonly tools: readonly ToolDefinition[];
    /** The tools as `tools/list` shows them, built once: the HTTP transport creates one server per request. */
    readonly listed: readonly Tool[];
};

export type PrepareOptions = {
    /** Another `fetch` (tests). */
    readonly fetch?: typeof fetch;
    readonly log?: Logger;
};

const userAgent = (config: ServerConfig): string => `uniquedomains-mcp-server/${SERVER_VERSION} (${config.profile})`;

export const createApiClient = (config: ServerConfig, fetchImpl?: typeof fetch): UniqueDomainsClient =>
    createClient({
        // null, never undefined: the SDK would otherwise read UD_API_KEY from the environment (the hosted profile ignores it).
        apiKey: config.apiKey,
        ...(config.apiBase !== null ? { baseUrl: config.apiBase } : {}),
        ...(config.connectorSecret !== null ? { headers: { 'X-UD-Connector-Secret': config.connectorSecret } } : {}),
        ...(fetchImpl ? { fetch: fetchImpl } : {}),
        userAgent: userAgent(config),
    });

/** The key's plan from `get_key`. A refused key stops the start; an API that does not answer leaves the free tools. */
export const readKeyPlan = async (client: UniqueDomainsClient, log: Logger): Promise<KeyPlan> => {
    try {
        // Bounded: on stdio this runs before the MCP handshake, so a hung API must not outlast the client's start timeout.
        const answer = await client.requestOperation('get_key', { signal: AbortSignal.timeout(KEY_BOOT_TIMEOUT_MS) });
        if (answer.notModified || 'text' in answer) return 'none';
        const data = answer.data;
        if (!isObject(data)) return 'none';
        if (data.plan === 'investor' || data.investorEndpoints === true) return 'investor';
        if (data.plan === 'founder') return 'founder';
        log('The member key has no paid plan: the keyed tools stay off. A Founder or Investor plan opens them.');
        return 'none';
    } catch (error) {
        if (error instanceof ApiProblemError && error.status === 401) throw new ConfigError(`UD_API_KEY was refused: ${error.detail}`);
        const reason = error instanceof ApiProblemError ? error.detail : error instanceof Error ? error.message : String(error);
        log(`Could not read the member key's plan (${reason}). Starting with the free tools only.`);
        return 'none';
    }
};

export const prepareServer = async (config: ServerConfig, options: PrepareOptions = {}): Promise<PreparedServer> => {
    const log = options.log ?? ((line: string) => process.stderr.write(`${line}\n`));
    const keyedClient = createApiClient(config, options.fetch);
    const plan = config.profile === 'local' && config.apiKey !== null ? await readKeyPlan(keyedClient, log) : 'none';
    // A key that opens no plan stays off the calls: the tools are the free ones, and it must not be charged for them.
    const client = config.apiKey !== null && plan === 'none' ? createApiClient({ ...config, apiKey: null }, options.fetch) : keyedClient;
    const tools = selectTools(TOOLS, config.profile, plan);
    return { config, client, plan, tools, listed: tools.map((tool) => toListedTool(tool, config.profile, plan)) };
};

/**
 * The tool as `tools/list` shows it. The two schema casts are the one boundary between the generated plain JSON
 * (`JsonObject`, written by `scripts/generate.mjs`) and the MCP SDK's zod-derived `Tool` type, which describes the
 * same JSON Schema objects with an open index.
 */
export const toListedTool = (tool: ToolDefinition, profile: Profile, plan: KeyPlan): Tool => ({
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: inputSchemaFor(tool, profile, plan) as Tool['inputSchema'],
    outputSchema: outputSchemaFor(tool, profile) as Tool['outputSchema'],
    annotations: { title: tool.title, ...tool.annotations },
});

export const createMcpServer = (prepared: PreparedServer, overrides: Partial<Pick<CallContext, 'sleep' | 'now' | 'timeoutMs'>> = {}): Server => {
    const server = new Server({ name: SERVER_NAME, title: 'Unique Domains', version: SERVER_VERSION }, { capabilities: { tools: { listChanged: false } }, instructions: instructionsFor(prepared.config.profile) });
    const byName = new Map(prepared.tools.map((tool) => [tool.name, tool]));
    const context: CallContext = {
        client: prepared.client,
        profile: prepared.config.profile,
        keyless: isKeyless(prepared.config.profile, prepared.plan),
        keyWithoutPlan: prepared.config.apiKey !== null && prepared.plan === 'none',
        ...overrides,
    };

    server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: [...prepared.listed] }));
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const tool = byName.get(request.params.name);
        // An unknown tool is a protocol error, not a tool error: JSON-RPC -32602, as the 2025-11-25 Tools page's
        // "Unknown tools" example shows (fix round A5).
        if (tool === undefined) throw new McpError(ErrorCode.InvalidParams, `There is no tool named ${request.params.name}. Call tools/list for the tools this server offers.`);
        return runTool(context, tool, request.params.arguments);
    });
    return server;
};
