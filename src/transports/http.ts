#!/usr/bin/env node
/*----------------------------------
- HTTP ENTRY
----------------------------------*/

/** `node dist/http.js`: the hosted connector's process (the Dockerfile's command). The app is in `src/httpApp.ts`. */

import { ConfigError } from '../config';
import { startHttpServer } from '../httpApp';

startHttpServer().catch((error: unknown) => {
    process.stderr.write(`${error instanceof ConfigError ? error.message : error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`);
    process.exit(1);
});
