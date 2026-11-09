/*----------------------------------
- STREAMABLE HTTP TRANSPORT
----------------------------------*/

/**
 * The hosted connector's HTTP app (`node dist/http.js` starts it, the Dockerfile's command; plan section 2 and 3). Stateless: a
 * new MCP server and transport per request, no session id, plain JSON answers (`enableJsonResponse`, so Cloudflare
 * proxies them as they are). One Node process, nothing stored.
 *
 *   POST /mcp                  the MCP endpoint
 *   GET|DELETE /mcp            405: a stateless server has no stream and no session to end
 *   OPTIONS /mcp               the CORS preflight (`Access-Control-Allow-Origin: *`)
 *   GET /healthz               liveness for Railway, no API call
 *   GET /.well-known/<name>    a directory's proof, from `UD_WELLKNOWN_FILES` (a variable change, no code deploy)
 *
 * Every answer is `Cache-Control: no-store`; a body over 1 MB is refused 413.
 */

import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { ConfigError, readConfig, type Environment, type ServerConfig } from './config';
import { DRAIN_LIMIT_BYTES, HTTP_BODY_LIMIT_BYTES } from './limits';
import { createMcpServer, prepareServer, SERVER_VERSION, type PreparedServer } from './server';

export type WellKnownFile = { readonly body: string; readonly contentType: string };

/**
 * `UD_WELLKNOWN_FILES`: a JSON object from a file name under `/.well-known/` to its body (a string, served as plain
 * text) or to `{ "body": "...", "contentType": "..." }`. Example:
 * `{"openai-apps-challenge":"<token>","mcp-registry-auth":"v=MCPv1; k=ed25519; p=<key>","glama.json":{"body":"{...}","contentType":"application/json"}}`.
 */
export const readWellKnownFiles = (env: Environment): ReadonlyMap<string, WellKnownFile> => {
    const raw = env.UD_WELLKNOWN_FILES?.trim();
    const files = new Map<string, WellKnownFile>();
    if (!raw) return files;
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new ConfigError('UD_WELLKNOWN_FILES must be a JSON object.');
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new ConfigError('UD_WELLKNOWN_FILES must be a JSON object.');
    for (const [key, value] of Object.entries(parsed)) {
        const name = key.replace(/^\/?(\.well-known\/)?/u, '');
        if (!/^[A-Za-z0-9._-]+$/u.test(name)) throw new ConfigError(`UD_WELLKNOWN_FILES: "${key}" is not a file name.`);
        if (typeof value === 'string') {
            files.set(name, { body: value, contentType: name.endsWith('.json') ? 'application/json' : 'text/plain; charset=utf-8' });
        } else if (value !== null && typeof value === 'object' && typeof value.body === 'string') {
            files.set(name, { body: value.body, contentType: typeof value.contentType === 'string' ? value.contentType : 'text/plain; charset=utf-8' });
        } else {
            throw new ConfigError(`UD_WELLKNOWN_FILES: "${key}" must be a string or { "body": string, "contentType"?: string }.`);
        }
    }
    return files;
};

const CORS_HEADERS: Readonly<Record<string, string>> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
    'Access-Control-Max-Age': '86400',
};

const send = (res: ServerResponse, status: number, body: string, contentType: string, extra: Readonly<Record<string, string>> = {}): void => {
    res.writeHead(status, { 'Content-Type': contentType, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra });
    res.end(body);
};

const sendJsonRpcError = (res: ServerResponse, status: number, code: number, message: string, extra: Readonly<Record<string, string>> = {}): void => {
    send(res, status, JSON.stringify({ jsonrpc: '2.0', error: { code, message }, id: null }), 'application/json', { ...CORS_HEADERS, ...extra });
};

class BodyTooLargeError extends Error {}

/**
 * Reads the body up to `limit` bytes. An oversized body is drained unread to its end before the refusal, so the 413
 * reaches a client still sending (answering mid-upload reset the connection on the client's side, review finding 6);
 * past `DRAIN_LIMIT_BYTES` the socket is cut, since a client that keeps sending gets no answer worth the wait.
 */
const readBody = (req: IncomingMessage, limit: number): Promise<string> =>
    new Promise((resolve, reject) => {
        // A declared length over the drain limit is cut at once; under it, the body is drained like a chunked one.
        const declared = Number(req.headers['content-length']);
        if (Number.isFinite(declared) && declared > DRAIN_LIMIT_BYTES) {
            req.destroy();
            reject(new BodyTooLargeError());
            return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        req.on('data', (chunk: Buffer) => {
            size += chunk.length;
            if (size > DRAIN_LIMIT_BYTES) {
                req.destroy();
                reject(new BodyTooLargeError());
                return;
            }
            if (size > limit) chunks.length = 0;
            else chunks.push(chunk);
        });
        req.on('end', () => (size > limit ? reject(new BodyTooLargeError()) : resolve(Buffer.concat(chunks).toString('utf8'))));
        req.on('error', reject);
    });

const handleMcpPost = async (prepared: PreparedServer, req: IncomingMessage, res: ServerResponse): Promise<void> => {
    let parsed: unknown;
    try {
        const body = await readBody(req, HTTP_BODY_LIMIT_BYTES);
        parsed = JSON.parse(body);
    } catch (error) {
        if (error instanceof BodyTooLargeError) sendJsonRpcError(res, 413, -32600, 'The request body is over 1 MB.', { Connection: 'close' });
        else sendJsonRpcError(res, 400, -32700, 'The request body is not JSON.');
        return;
    }
    const server = createMcpServer(prepared);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => {
        void transport.close();
        void server.close();
    });
    for (const [name, value] of Object.entries(CORS_HEADERS)) res.setHeader(name, value);
    res.setHeader('Cache-Control', 'no-store');
    await server.connect(transport);
    await transport.handleRequest(req, res, parsed);
};

export type HttpAppOptions = { readonly wellKnown: ReadonlyMap<string, WellKnownFile> };

/** The request handler, apart from `listen`, so the tests run it on a free port. */
export const createRequestHandler =
    (prepared: PreparedServer, options: HttpAppOptions) =>
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const path = url.pathname.replace(/\/+$/u, '') || '/';
        try {
            if (path === '/mcp') {
                if (req.method === 'OPTIONS') return send(res, 204, '', 'text/plain', CORS_HEADERS);
                if (req.method === 'POST') return await handleMcpPost(prepared, req, res);
                return sendJsonRpcError(res, 405, -32000, 'This server is stateless: send JSON-RPC requests with POST.', { Allow: 'POST, OPTIONS' });
            }
            if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed.\n', 'text/plain; charset=utf-8', { Allow: 'GET, HEAD' });
            if (path === '/healthz') {
                return send(res, 200, JSON.stringify({ ok: true, version: SERVER_VERSION, tools: prepared.tools.length }), 'application/json');
            }
            if (path.startsWith('/.well-known/')) {
                const file = options.wellKnown.get(path.slice('/.well-known/'.length));
                if (file) return send(res, 200, file.body, file.contentType, { 'Access-Control-Allow-Origin': '*' });
                return send(res, 404, 'Not found.\n', 'text/plain; charset=utf-8');
            }
            if (path === '/') {
                return send(res, 200, 'Unique Domains MCP server. Connect an MCP client to /mcp. Documentation: https://github.com/UniqueDomains/mcp-server\n', 'text/plain; charset=utf-8');
            }
            return send(res, 404, 'Not found.\n', 'text/plain; charset=utf-8');
        } catch (error) {
            process.stderr.write(`${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`);
            if (!res.headersSent) sendJsonRpcError(res, 500, -32603, 'The server could not answer. Try again in a minute.');
            else res.end();
        }
    };

/**
 * The HTTP transport answers anyone (`Access-Control-Allow-Origin: *`), so it never serves a member key: the local
 * profile with `UD_API_KEY` set would open the owner's keyed tools and month to whoever reaches the port.
 */
export const assertServable = (config: ServerConfig): void => {
    if (config.profile === 'local' && config.apiKey !== null) {
        throw new ConfigError('The HTTP server answers anyone, so it does not serve UD_API_KEY: set UD_MCP_PROFILE=hosted, or run the npm server over stdio for a member key.');
    }
};

/** Reads the environment, prepares the tools and listens on `PORT` (8080 by default). */
export const startHttpServer = async (env: Environment = process.env): Promise<void> => {
    const config = readConfig(env);
    assertServable(config);
    const wellKnown = readWellKnownFiles(env);
    const prepared = await prepareServer(config);
    const port = Number(env.PORT ?? 8080);
    const http = createHttpServer((req, res) => void createRequestHandler(prepared, { wellKnown })(req, res));
    http.listen(port, () => {
        process.stdout.write(
            `uniquedomains-mcp-server ${SERVER_VERSION} on :${port}, ${config.profile} profile, ${prepared.tools.length} tools, connector secret ${config.connectorSecret ? 'set' : 'not set'}, ${wellKnown.size} well-known files.\n`,
        );
    });
    const stop = (): void => {
        http.close(() => process.exit(0));
        setTimeout(() => process.exit(0), 5000).unref();
    };
    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
};
