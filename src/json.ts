/*----------------------------------
- JSON VALUES
----------------------------------*/

import type { JsonObject, JsonValue } from '@uniquedomains/sdk';

/** `Array.isArray` does not narrow a readonly array out of a union, hence the guard. */
export const isObject = (value: JsonValue | undefined): value is JsonObject => value !== null && typeof value === 'object' && !Array.isArray(value);
