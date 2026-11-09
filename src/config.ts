/*----------------------------------
- CONFIGURATION
----------------------------------*/

/**
 * Reads the environment once, at start. Two profiles (plan section 2, `src/profile.ts`):
 *
 * - `local` (the default, the npm package): the user's own process. `UD_API_KEY` adds the keyed tools of the key's
 *   plan; every link of the API's answer is kept.
 * - `hosted` (`UD_MCP_PROFILE=hosted`, the connector at `https://mcp.unique.domains/mcp`): free tools only, whatever
 *   the environment holds. It never sends `Authorization` (a member key resolves first at the API and would bill that
 *   member, review of P1), so `UD_API_KEY` is ignored; it sends `X-UD-Connector-Secret` when `UD_CONNECTOR_SECRET` is
 *   set and not blank (a blank header is refused 401 at the API, P1-1).
 */

export type Profile = 'local' | 'hosted';

export type ServerConfig = {
    readonly profile: Profile;
    /** A member key, local profile only. */
    readonly apiKey: string | null;
    /** Another API base (a local run of the API, tests). */
    readonly apiBase: string | null;
    /** The connector's shared secret, hosted profile only. */
    readonly connectorSecret: string | null;
};

export type Environment = Readonly<Record<string, string | undefined>>;

const nonBlank = (value: string | undefined): string | null => {
    const trimmed = value?.trim() ?? '';
    return trimmed === '' ? null : trimmed;
};

export class ConfigError extends Error {
    override readonly name = 'ConfigError';
}

export const readProfile = (env: Environment): Profile => {
    const value = nonBlank(env.UD_MCP_PROFILE);
    if (value === null || value === 'local') return 'local';
    if (value === 'hosted') return 'hosted';
    throw new ConfigError(`UD_MCP_PROFILE must be "local" or "hosted", not "${value}".`);
};

export const readConfig = (env: Environment): ServerConfig => {
    const profile = readProfile(env);
    const apiBase = nonBlank(env.UD_API_BASE);
    if (apiBase !== null && !/^https?:\/\//u.test(apiBase)) throw new ConfigError(`UD_API_BASE must be an http or https URL, not "${apiBase}".`);
    if (profile === 'hosted') return { profile, apiKey: null, apiBase, connectorSecret: nonBlank(env.UD_CONNECTOR_SECRET) };
    return { profile, apiKey: nonBlank(env.UD_API_KEY), apiBase, connectorSecret: null };
};
