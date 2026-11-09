/*----------------------------------
- TOOL INPUT CHECK
----------------------------------*/

/**
 * Checks a tool call's arguments against the operation's parameters (`OPERATIONS[id].parameters` and its body
 * properties) before any request, and splits them into the SDK's `path`, `query` and `body`. The SDK checks the shape
 * of a call but not the values (Gaetan's N1 A of 2026-11-09), so the values are checked here, with a message an
 * assistant can act on: the input, what was wrong and what is accepted (Anthropic's directory asks for actionable
 * validation messages).
 *
 * Lenient where an assistant often slips: a number or a boolean sent as a string is read as one, a string is trimmed,
 * and a list sent for a comma-list input is joined. A missing `limit` is
 * not filled in: the API's own default is the 20 the input schema shows, and the free grade refuses `limit` outright
 * on its fixed-cut endpoints (`list_registrar_prices`, ...), so sending it unasked would break those calls.
 */

import type { JsonObject, JsonValue, OperationDefinition, OperationParameter, BodyProperty } from '@uniquedomains/sdk';

export type SplitInput = {
    readonly path: Record<string, string | number>;
    readonly query: Record<string, string | number | boolean>;
    readonly body: JsonObject | undefined;
};

export class InputError extends Error {
    override readonly name = 'InputError';
}

type Scalar = string | number | boolean;

const describeAccepted = (parameter: Pick<OperationParameter, 'type' | 'enum' | 'minimum' | 'maximum'>): string => {
    if (parameter.enum) return `one of ${parameter.enum.map((value) => JSON.stringify(value)).join(', ')}`;
    const kind = parameter.type === 'integer' ? 'a whole number' : parameter.type === 'number' ? 'a number' : parameter.type === 'boolean' ? 'true or false' : 'a string';
    const range =
        parameter.minimum !== undefined && parameter.maximum !== undefined
            ? ` from ${parameter.minimum} to ${parameter.maximum}`
            : parameter.minimum !== undefined
              ? ` of at least ${parameter.minimum}`
              : parameter.maximum !== undefined
                ? ` of at most ${parameter.maximum}`
                : '';
    return `${kind}${range}`;
};

/** One scalar value read as the parameter's type, or an error naming what is accepted. */
const readScalar = (name: string, parameter: Pick<OperationParameter, 'type' | 'enum' | 'minimum' | 'maximum'>, raw: unknown): Scalar => {
    const refuse = (): never => {
        throw new InputError(`\`${name}\` must be ${describeAccepted(parameter)}; got ${JSON.stringify(raw)}.`);
    };
    let value: Scalar;
    switch (parameter.type) {
        case 'integer':
        case 'number': {
            const number = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : Number.NaN;
            if (!Number.isFinite(number)) return refuse();
            if (parameter.type === 'integer' && !Number.isInteger(number)) return refuse();
            if (parameter.minimum !== undefined && number < parameter.minimum) return refuse();
            if (parameter.maximum !== undefined && number > parameter.maximum) return refuse();
            value = number;
            break;
        }
        case 'boolean':
            if (typeof raw === 'boolean') value = raw;
            else if (raw === 'true' || raw === 'false') value = raw === 'true';
            else return refuse();
            break;
        default:
            if (typeof raw === 'string') value = raw.trim();
            else if (typeof raw === 'number') value = String(raw);
            else return refuse();
            if (value === '') return refuse();
    }
    if (parameter.enum && !parameter.enum.some((allowed) => allowed === value)) return refuse();
    return value;
};

const readBodyProperty = (property: BodyProperty, raw: unknown): JsonValue => {
    if (property.type !== 'array') return readScalar(property.name, { type: property.type, enum: property.enum }, raw);
    const items = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',').map((item) => item.trim()).filter((item) => item !== '') : null;
    if (items === null || items.length === 0) throw new InputError(`\`${property.name}\` must be a non-empty list; got ${JSON.stringify(raw)}.`);
    const itemType = property.items ?? { type: 'string' as const };
    return items.map((item) => readScalar(`${property.name}[]`, { type: itemType.type, enum: itemType.enum }, item));
};

/** A list for an input the API reads as a comma list ("Comma list of statuses", "Comma-separated keys"), joined. */
const joinCommaList = (parameter: OperationParameter, raw: unknown): unknown =>
    Array.isArray(raw) && parameter.type === 'string' && /^comma/iu.test(parameter.description) && raw.every((item) => typeof item === 'string' || typeof item === 'number') ? raw.join(',') : raw;

/** @boundary `args` are the tool call's arguments as the client sent them. */
export const splitInput = (operation: OperationDefinition, args: Readonly<Record<string, unknown>> | undefined): SplitInput => {
    const given = args ?? {};
    const known = new Set([...operation.parameters.map((parameter) => parameter.name), ...(operation.body?.properties.map((property) => property.name) ?? [])]);
    const unknown = Object.keys(given).filter((key) => !known.has(key));
    if (unknown.length > 0) {
        const accepted = [...known];
        throw new InputError(
            `This tool does not take ${unknown.map((key) => `\`${key}\``).join(', ')}. ${accepted.length > 0 ? `It takes ${accepted.map((key) => `\`${key}\``).join(', ')}.` : 'It takes no input.'}`,
        );
    }

    const path: Record<string, string | number> = {};
    const query: Record<string, string | number | boolean> = {};
    for (const parameter of operation.parameters) {
        const raw = joinCommaList(parameter, given[parameter.name]);
        if (raw === undefined || raw === null) {
            if (parameter.required) throw new InputError(`\`${parameter.name}\` is required: ${parameter.description}`);
            continue;
        }
        const value = readScalar(parameter.name, parameter, raw);
        // A path segment of `.` or `..`, or one holding a slash, would move the request to another path.
        if (parameter.in === 'path' && typeof value === 'string' && (value === '.' || value === '..' || value.includes('/'))) {
            throw new InputError(`\`${parameter.name}\` must be one path segment; got ${JSON.stringify(raw)}.`);
        }
        if (parameter.in === 'path') path[parameter.name] = typeof value === 'boolean' ? String(value) : value;
        else query[parameter.name] = value;
    }

    let body: JsonObject | undefined;
    if (operation.body) {
        const entries: [string, JsonValue][] = [];
        for (const property of operation.body.properties) {
            const raw = given[property.name];
            if (raw === undefined || raw === null) {
                if (property.required) throw new InputError(`\`${property.name}\` is required${property.description ? `: ${property.description}` : '.'}`);
                continue;
            }
            entries.push([property.name, readBodyProperty(property, raw)]);
        }
        // An optional body with nothing in it is still sent, empty: the API reads its defaults.
        body = Object.fromEntries(entries);
    }
    return { path, query, body };
};
