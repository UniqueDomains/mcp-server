# The hosted connector (plan sections 2 and 3): Railway builds this file from the repository root and runs
# `node dist/http.js` with UD_MCP_PROFILE=hosted. The build stage compiles and drops the dev dependencies; the run
# stage is distroless Node 22 as a non-root user, with no shell and no package manager.

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json tsup.config.ts ./
COPY src ./src
RUN npm run build && npm prune --omit=dev --ignore-scripts

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production \
    UD_MCP_PROFILE=hosted \
    PORT=8080
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8080
# The distroless image's entrypoint is `node`.
CMD ["dist/http.js"]
