import { defineConfig } from 'tsup';

/**
 * Three entries: `dist/stdio.js` is the npm bin (`npx @uniquedomains/mcp-server`), `dist/http.js` the hosted
 * connector's process (the Dockerfile's command), `dist/index.js` the library entry the tests import. ESM only.
 */
export default defineConfig({
    entry: { stdio: 'src/transports/stdio.ts', http: 'src/transports/http.ts', index: 'src/index.ts' },
    format: ['esm'],
    target: 'node20',
    platform: 'node',
    clean: true,
    splitting: true,
    sourcemap: false,
    dts: false,
});
