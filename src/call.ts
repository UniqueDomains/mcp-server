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

import { ApiProblemError, isOperationId, OPERATIONS, type JsonObject, type JsonValue, type UniqueDomainsClient } from '@uniquedomains/sdk';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import type { Profile } from './config';
import { RETRY_AFTER_MAX_SECONDS } from './limits';
import { isObject, shapeAnswer, textLine } from './profile';
import type { ToolDefinition } from './tool';
import { InputError, splitInput } from './validate';

export type CallContext = {
    readonly client: UniqueDomainsClient;
    readonly profile: Profile;
    /** Waits before the one retry of a short 429 (tests pass a stub). */
    readonly sleep?: (milliseconds: number) => Promise<void>;
    readonly now?: () => Date;
};

const sleepFor = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

const errorResult = (text: string): CallToolResult => ({ isError: true, content: [{ type: 'text', text }] });

/* ---------- Refusals ---------- */

const pad = (value: number): string => String(value).padStart(2, '0');

/** "at 00:00 UTC (in about 7 hours)", from a wait in seconds. */
export const resetPhrase = (seconds: number, now: Date): string => {
    const at = new Date(now.getTime() + seconds * 1000);
    const minutes = Math.ceil(seconds / 60);
    const wait = minutes < 90 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : `${Math.round(minutes / 60)} hours`;
    return `at ${pad(at.getUTCHours())}:${pad(at.getUTCMinutes())} UTC (in about ${wait})`;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayPhrase = (date: Date): string => `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

const sentence = (text: string): string => {
    const trimmed = text.trim();
    return trimmed === '' || /[.?!]$/u.test(trimmed) ? trimmed : `${trimmed}.`;
};

/** The assistant-facing sentence of a refusal, by problem code (plan section 2 and the P1 amendments). */
export const refusalText = (error: ApiProblemError, profile: Profile, now: Date): string => {
    const detail = sentence(error.detail || error.title || `The API refused the call (${error.code}).`);
    const problem = error.problem;
    switch (error.code) {
        case 'validation_failed':
        case 'cursor_invalid':
        case 'unsupported_field': {
            const suggestion = typeof problem.suggestion === 'string' ? problem.suggestion.trim() : '';
            return suggestion === '' ? detail : `${detail} Try: ${sentence(suggestion)}`;
        }
        case 'plan_required':
            if (profile === 'hosted' || !error.product) return `${detail} This tool comes with the Investor plan.`;
            return `${detail} This tool comes with the Investor plan; move to Investor at ${error.product}.`;
        case 'keyed_only':
            return `${detail} This tool needs a member key or a RapidAPI plan.`;
        case 'quota_spent': {
            const resetsAt = error.quota?.resetsAt ?? (error.retryAfter !== null ? new Date(now.getTime() + error.retryAfter * 1000) : null);
            return resetsAt === null ? `${detail} The month's allowance is spent.` : `${detail} The allowance starts again on ${dayPhrase(resetsAt)}.`;
        }
        case 'rate_limited':
        case 'budget_spent':
        case 'consumer_day_cap':
        case 'intake_day_cap': {
            const shared = profile === 'hosted' ? ' This connector shares one daily allowance among its users.' : '';
            if (error.retryAfter === null) return `${detail}${shared} Try again later.`;
            return `${detail}${shared} It resets ${resetPhrase(error.retryAfter, now)}.`;
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
            if (error.status === 503 || error.status >= 500) return `${detail} Try again in a minute.`;
            return detail;
    }
};

/* ---------- The call ---------- */

const callOnce = (context: CallContext, operationId: string, input: ReturnType<typeof splitInput>) => {
    if (!isOperationId(operationId)) throw new Error(`Unknown operation ${operationId}`);
    const hasPath = Object.keys(input.path).length > 0;
    const hasQuery = Object.keys(input.query).length > 0;
    return context.client.requestOperation(operationId, {
        ...(hasPath ? { path: input.path } : {}),
        ...(hasQuery ? { query: input.query } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
    });
};

/** @boundary `args` are the tool call's arguments as the client sent them. */
export const runTool = async (context: CallContext, tool: ToolDefinition, args: Readonly<Record<string, unknown>> | undefined): Promise<CallToolResult> => {
    const now = context.now ?? (() => new Date());
    const operation = isOperationId(tool.operationId) ? OPERATIONS[tool.operationId] : undefined;
    if (operation === undefined) return errorResult(`The tool ${tool.name} has no operation in this version of the server.`);

    let input: ReturnType<typeof splitInput>;
    try {
        input = splitInput(operation, args);
    } catch (error) {
        if (error instanceof InputError) return errorResult(error.message);
        throw error;
    }

    let answer;
    try {
        try {
            answer = await callOnce(context, tool.operationId, input);
        } catch (error) {
            // One retry of a short 429 (the SDK already retried a one-second wait once); a longer wait is told instead.
            if (!(error instanceof ApiProblemError) || error.status !== 429 || error.code !== 'rate_limited') throw error;
            if (error.retryAfter === null || error.retryAfter > RETRY_AFTER_MAX_SECONDS) throw error;
            await (context.sleep ?? sleepFor)(Math.max(1, error.retryAfter) * 1000);
            answer = await callOnce(context, tool.operationId, input);
        }
    } catch (error) {
        if (error instanceof ApiProblemError) return errorResult(refusalText(error, context.profile, now()));
        if (error instanceof TypeError) return errorResult('The Unique Domains API did not answer. Try again in a minute.');
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
    if (answer.status === 202) {
        const wait = answer.retryAfter ?? 30;
        line = `Not ready yet: the scanner is still working on it. Call this tool again in about ${wait} seconds. ${line}`;
    }
    return {
        structuredContent: structured,
        content: [
            { type: 'text', text: line },
            { type: 'text', text: JSON.stringify(structured) },
        ],
    };
};
