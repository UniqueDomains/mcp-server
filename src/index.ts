/*----------------------------------
- @uniquedomains/mcp-server, as a library
----------------------------------*/

/**
 * The program is the bin (`dist/stdio.js`) or the hosted process (`dist/http.js`). This entry exposes the same pieces
 * to embed the server in another Node process, and to the tests.
 */

export { readConfig, readProfile, ConfigError } from './config';
export type { Environment, Profile, ServerConfig } from './config';
export { createApiClient, createMcpServer, prepareServer, readKeyPlan, toListedTool, INSTRUCTIONS, SERVER_NAME, SERVER_VERSION } from './server';
export type { Logger, PreparedServer, PrepareOptions } from './server';
export { runTool, refusalText, resetPhrase } from './call';
export type { CallContext } from './call';
export { isObject } from './json';
export { PLAN_TALK, selectTools, shapeAnswer, textLine, outputSchemaFor } from './profile';
export type { KeyPlan, StructuredAnswer } from './profile';
export { splitInput, InputError } from './validate';
export { detailsFor, registrarSlug, DETAILS_RULES, DETAILS_SAMPLES, WEBSITE } from './details';
export { TOOLS, TOOLS_DOCUMENT_VERSION, TOOLS_SDK_VERSION } from './generated/tools';
export type { ToolDefinition, JsonSchema } from './tool';
export { assertServable, createRequestHandler, readWellKnownFiles, startHttpServer } from './httpApp';
export type { WellKnownFile, HttpAppOptions } from './httpApp';
