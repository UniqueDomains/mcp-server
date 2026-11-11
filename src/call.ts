/*----------------------------------
- ONE TOOL CALL
----------------------------------*/

/**
 * Runs one tool: checks the input, calls the API through the SDK, and answers MCP's result. A success carries
 * `structuredContent` (the envelope's `data`, `meta` and `links`, shaped by the profile) and `content` with one line
 * for a reader, then the same JSON as text (the MCP specification asks a tool with structured content to also return
 * it serialized, for clients that read `content` only). A refusal carries `isError: true` and a sentence the assistant
 * can act on, never a bare status (plan section 2; both directories refuse generic errors).
 *
 * The server stores nothing and adds no limiter of its own (Gaetan, 2026-11-06).
 */

import { ApiProblemError, isOperationId, OPERATIONS, type JsonObject, type JsonValue, type OperationId, type UniqueDomainsClient } from '@uniquedomains/sdk';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import type { Profile } from './config';
import { CALL_TIMEOUT_MS, RETRY_AFTER_MAX_SECONDS } from './limits';
import { isObject } from './json';
import { KEYLESS_LIMIT_MAX, PLAN_TALK, shapeAnswer, textLine } from './profile';
import type { ToolDefinition } from './tool';
import { InputError, splitInput, type InputView } from './validate';

export type CallContext = {
    readonly client: UniqueDomainsClient;
    readonly profile: Profile;
    /** No key behind the calls (the hosted connector, or the npm server without a paid member key). */
    readonly keyless: boolean;
    /** A key was set, but it opens no plan (or its plan could not be read at start), so calls go out without it. */
    readonly keyWithoutPlan?: boolean;
    /** Waits before the one retry of a short 429 (tests pass a stub). */
    readonly sleep?: (milliseconds: number) => Promise<void>;
    readonly now?: () => Date;
    /** The deadline of one API request (tests pass a short one). */
    readonly timeoutMs?: number;
};

const sleepFor = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

const errorResult = (text: string): CallToolResult => ({ isError: true, content: [{ type: 'text', text }] });

/* ---------- Refusals ---------- */

const pad = (value: number): string => String(value).padStart(2, '0');

/** "at 00:00 UTC (in about 7 hours)", from a wait in seconds; under a minute the wait is said in seconds. */
export const resetPhrase = (seconds: number, now: Date): string => {
    const at = new Date(now.getTime() + seconds * 1000);
    const minutes = Math.ceil(seconds / 60);
    const rounded = Math.max(1, Math.round(seconds));
    const wait =
        rounded < 60
            ? `${rounded} ${rounded === 1 ? 'second' : 'seconds'}`
            : minutes < 90
              ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
              : `${Math.round(minutes / 60)} hours`;
    return `at ${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())} UTC (in about ${wait})`;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayPhrase = (date: Date): string => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

const sentence = (text: string): string => {
    const trimmed = text.trim();
    return trimmed === '' || /[.?!]$/u.test(trimmed) ? trimmed : `${trimmed}.`;
};

/** The hosted connector's own words for a spent allowance, when the API's detail names a grade (fix round A6). */
const HOSTED_RATE_SPENT = "This connector has reached the API's limit of calls.";
const HOSTED_DAY_SPENT = "This connector's daily allowance is spent.";

const HOSTED_FREE_ONLY = 'This connector serves the free answers only, and that input or page is not one of them. Call the tool again without it.';

/** The assistant-facing sentence of a refusal, by problem code (plan section 2 and the P1 amendments). */
export const refusalText = (error: ApiProblemError, profile: Profile, now: Date): string => {
    const detail = sentence(error.detail || error.title || `The API refused the call (${error.code}).`);
    const problem = error.problem;
    switch (error.code) {
        case 'validation_failed':
        case 'cursor_invalid':
        case 'unsupported_field': {
            const suggestion = typeof problem.suggestion === 'string' ? problem.suggestion.trim() : '';
            // A fixed cut's `limit` comes back as a 400 naming a paid subscription: never repeated on the hosted profile (decision 15).
            if (profile === 'hosted' && PLAN_TALK.test(`${detail} ${suggestion}`)) return HOSTED_FREE_ONLY;
            return suggestion === '' ? detail : `${detail} Try: ${sentence(suggestion)}`;
        }
        case 'plan_required':
            // The hosted connector serves free tools only and names no plan (decision 15).
            if (profile === 'hosted') return 'This connector serves the free answers only, and that call is not one of them.';
            if (!error.product) return `${detail} This tool comes with the Investor plan.`;
            return `${detail} This tool comes with the Investor plan; move to Investor at ${error.product}.`;
        case 'keyed_only':
            // The hosted connector carries no plan talk (decision 15): the API's own detail names the paid tiers.
            if (profile === 'hosted') return HOSTED_FREE_ONLY;
            return `${detail} This tool needs a member key or a RapidAPI plan.`;
        case 'quota_spent': {
            const resetsAt = error.quota?.resetsAt ?? (error.retryAfter !== null ? new Date(now.getTime() + error.retryAfter * 1000) : null);
            return resetsAt === null ? `${detail} The month's allowance is spent.` : `${detail} The allowance starts again on ${dayPhrase(resetsAt)}.`;
        }
        case 'rate_limited':
        case 'budget_spent':
        case 'consumer_day_cap':
        case 'intake_day_cap': {
            // The per-second limit is not the shared day: only the day's caps carry the clause.
            const shared = profile === 'hosted' && error.code !== 'rate_limited' ? ' This connector shares one daily allowance among its users.' : '';
            // On the hosted connector the connector speaks for itself (decision 15, fix round A6): the API's ceiling detail
            // names its grade ("the free tier's daily ceiling for all callers"), and its budget detail carries its own
            // reset time, which the reset phrase below would repeat.
            const said = profile !== 'hosted' ? detail : error.code !== 'rate_limited' ? HOSTED_DAY_SPENT : PLAN_TALK.test(detail) ? HOSTED_RATE_SPENT : detail;
            if (error.retryAfter === null) return `${said}${shared} Try again later.`;
            return `${said}${shared} It resets ${resetPhrase(error.retryAfter, now)}.`;
        }
        case 'invalid_key':
            return `${detail} Check UD_API_KEY: a member key is created in Unique Domains under Settings, Account, API.`;
        case 'invalid_proxy_secret':
            return 'The connector could not authenticate with the API. Try again in a minute.';
        case 'not_ready':
        case 'check_unavailable':
        case 'gate_unavailable':
        case 'internal':
            return `${detail} Try again in a minute.`;
        default:
            if (error.status >= 500) return `${detail} Try again in a minute.`;
            return detail;
    }
};

/* ---------- Accepted answers ---------- */

/**
 * What to do after a 202, per operation (review finding 1). Calling a metered tool again is never the advice when it
 * would spend another unit: `check_name` bills a Live unit whenever the registry was asked, so the stored resource is
 * read with `ud_get_name`; a word request is followed with `ud_get_word_request`, since a new request counts against
 * the day's intake. `appraise_name` bills nothing while another run holds the name, so it may be called again.
 */
export const acceptedLine = (operationId: string, wait: number, data: JsonValue): string => {
    const seconds = `about ${Math.max(1, Math.round(wait))} seconds`;
    if (operationId === 'check_name') return `Not ready yet: the scanner is still reading the name. Read it with ud_get_name in ${seconds}; calling ud_check_name again spends another live check.`;
    if (operationId === 'request_word') {
        const requestId = isObject(data) && typeof data.requestId === 'string' ? data.requestId : null;
        const follow = requestId === null ? 'ud_get_word_request' : `ud_get_word_request with requestId ${requestId}`;
        return `Queued: the word joins the catalog's intake. Follow it with ${follow} in ${seconds}.`;
    }
    return `Not ready yet: the scanner is still working on it. Call this tool again in ${seconds}.`;
};

/**
 * A request that never reached the API: `fetch` rejects with a `TypeError` whose `cause` is the socket error. Any other
 * `TypeError` is a refusal of the input (the SDK refuses a `..` path segment that way, review finding 7) and is
 * rethrown rather than reported as an API outage.
 */
const isNetworkFailure = (error: unknown): boolean => error instanceof TypeError && (error.message === 'fetch failed' || error.cause !== undefined);

/** The call's own deadline ran out (`AbortSignal.timeout` rejects with a `TimeoutError` DOMException). */
const isTimeout = (error: unknown): boolean => error instanceof Error && error.name === 'TimeoutError';

/* ---------- The call ---------- */

/** The inputs as the tool shows them: its own descriptions, and the keyless `limit` bound without a key. */
const inputViewOf = (tool: ToolDefinition, keyless: boolean): InputView => {
    const descriptions: Record<string, string> = {};
    const properties = tool.inputSchema.properties;
    if (isObject(properties)) {
        for (const [name, schema] of Object.entries(properties)) if (isObject(schema) && typeof schema.description === 'string') descriptions[name] = schema.description;
    }
    return { descriptions, ...(keyless ? { limitMaximum: KEYLESS_LIMIT_MAX } : {}) };
};

const callOnce = (context: CallContext, operationId: OperationId, input: ReturnType<typeof splitInput>) => {
    const hasPath = Object.keys(input.path).length > 0;
    const hasQuery = Object.keys(input.query).length > 0;
    return context.client.requestOperation(operationId, {
        ...(hasPath ? { path: input.path } : {}),
        ...(hasQuery ? { query: input.query } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        signal: AbortSignal.timeout(context.timeoutMs ?? CALL_TIMEOUT_MS),
    });
};

/** @boundary `args` are the tool call's arguments as the client sent them. */
export const runTool = async (context: CallContext, tool: ToolDefinition, args: Readonly<Record<string, unknown>> | undefined): Promise<CallToolResult> => {
    const now = context.now ?? (() => new Date());
    const operationId = tool.operationId;
    if (!isOperationId(operationId)) return errorResult(`The tool ${tool.name} has no operation in this version of the server.`);
    const operation = OPERATIONS[operationId];

    // Without a key, the inputs only a key may send are hidden from the schema and refused here before any call.
    const keyedSent = context.keyless ? tool.keyedParameters.filter((name) => args?.[name] !== undefined && args[name] !== null) : [];
    if (keyedSent.length > 0) {
        const names = keyedSent.map((name) => `\`${name}\``).join(', ');
        if (context.profile === 'hosted') return errorResult(`This connector does not take ${names}. Call the tool again without it.`);
        if (context.keyWithoutPlan === true) return errorResult(`${names} needs a member key on a paid plan, and UD_API_KEY opens none (or its plan could not be read when the server started). Call the tool again without it.`);
        return errorResult(`${names} needs a member key: set UD_API_KEY (Settings, Account, API in Unique Domains), or call the tool again without it.`);
    }

    let input: ReturnType<typeof splitInput>;
    try {
        input = splitInput(operation, args, inputViewOf(tool, context.keyless));
    } catch (error) {
        if (error instanceof InputError) return errorResult(error.message);
        throw error;
    }

    let answer;
    try {
        try {
            answer = await callOnce(context, operationId, input);
        } catch (error) {
            // One retry of a short 429. A wait of one second or less was already retried once by the SDK, so it is not
            // retried again here (review finding 4); a wait over RETRY_AFTER_MAX_SECONDS is told instead.
            if (!(error instanceof ApiProblemError) || error.status !== 429 || error.code !== 'rate_limited') throw error;
            if (error.retryAfter === null || error.retryAfter <= 1 || error.retryAfter > RETRY_AFTER_MAX_SECONDS) throw error;
            await (context.sleep ?? sleepFor)(Math.max(1, error.retryAfter) * 1000);
            answer = await callOnce(context, operationId, input);
        }
    } catch (error) {
        if (error instanceof ApiProblemError) return errorResult(refusalText(error, context.profile, now()));
        if (isNetworkFailure(error)) return errorResult('The Unique Domains API did not answer. Try again in a minute.');
        if (isTimeout(error)) return errorResult('The Unique Domains API took too long to answer. Try again in a minute.');
        throw error;
    }

    if (answer.notModified || 'text' in answer) return errorResult('The API answered with a file this tool does not read.');

    const envelope = {
        data: answer.data,
        // @boundary The SDK types `meta` and `links` from the schema with an open index; their values are plain JSON.
        meta: (answer.meta ?? {}) as JsonObject,
        links: (answer.links ?? {}) as JsonObject,
    };
    const echoed: Record<string, JsonValue | undefined> = { ...input.path, ...input.query };
    const structured = shapeAnswer(context.profile, tool.operationId, echoed, envelope);
    let line = textLine(tool.title, structured);
    if (answer.status === 202) line = `${acceptedLine(tool.operationId, answer.retryAfter ?? 30, structured.data)} ${line}`;
    return {
        structuredContent: structured,
        content: [
            { type: 'text', text: line },
            { type: 'text', text: JSON.stringify(structured) },
        ],
    };
};
