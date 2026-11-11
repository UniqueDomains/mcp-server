/*----------------------------------
- THE PLUGIN BUNDLE'S SHARED FACTS
----------------------------------*/

/** The hosted connector every server entry of the bundle points at. */
export const HOSTED_MCP_URL = 'https://mcp.unique.domains/mcp';

/** The keys Devin's validator allows in `.devin-plugin/plugin.json` (`scripts/validate.py`, `PLUGIN_KEYS`, read 2026-11-11). */
export const DEVIN_PLUGIN_KEYS = ['name', 'displayName', 'description', 'shortDescription', 'setup', 'homepage', 'repository', 'logo', 'keywords', 'mcpServers'];
