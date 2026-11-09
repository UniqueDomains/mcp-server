/*----------------------------------
- TOOL DEFINITION
----------------------------------*/

/**
 * The shape of one generated tool (`src/generated/tools.ts`, written by `scripts/generate.mjs`). A field added here is
 * a change of the generator too.
 */

import type { JsonObject } from '@uniquedomains/sdk';

/** A JSON Schema as plain JSON: the generator writes it from the API document. */
export type JsonSchema = JsonObject;

export type ToolAnnotationsDefinition = {
    readonly readOnlyHint: boolean;
    readonly destructiveHint: boolean;
    readonly idempotentHint: boolean;
    readonly openWorldHint: boolean;
};

export type ToolDefinition = {
    /** `ud_<operationId>`. */
    readonly name: string;
    readonly operationId: string;
    readonly title: string;
    /** The operation's summary and one clause on what to pass. */
    readonly description: string;
    /** `free` answers without a key; `keyed` needs a member key (the server registers it only then). */
    readonly tier: 'free' | 'keyed';
    /** `investor` when only the Investor plan opens it. */
    readonly plan: string | null;
    /** The metered unit a call spends, or null. */
    readonly metered: string | null;
    /** Whether the hosted connector registers it (free tools outside the one-a-day gates). */
    readonly hosted: boolean;
    readonly inputSchema: JsonSchema;
    /** Inputs only a key may send (`x-tier: keyed` on the parameter); hidden and refused without a key. */
    readonly keyedParameters: readonly string[];
    readonly outputSchema: JsonSchema;
    readonly annotations: ToolAnnotationsDefinition;
    /** One reason per annotation value, for the directories' reviews. */
    readonly justification: { readonly readOnly: string; readonly openWorld: string; readonly destructive: string };
};
