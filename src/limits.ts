/*----------------------------------
- FIXED FIGURES
----------------------------------*/

/**
 * A 429 `rate_limited` whose `Retry-After` is above 1 and at most this many seconds is retried once by the server; a
 * wait of 1 second or less was already retried once by the SDK (so the server does not add a second round, review
 * finding 4), and a longer wait is told to the assistant.
 */
export const RETRY_AFTER_MAX_SECONDS = 5;

/** How long the start waits for `get_key` before it falls back to the free tools (review finding 9). */
export const KEY_BOOT_TIMEOUT_MS = 10_000;

/** The request body limit of the HTTP transport (plan section 2). */
export const HTTP_BODY_LIMIT_BYTES = 1024 * 1024;

/** How much of an oversized body the HTTP transport drains before it cuts the socket (see `readBody`). */
export const DRAIN_LIMIT_BYTES = 16 * 1024 * 1024;
