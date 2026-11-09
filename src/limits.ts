/*----------------------------------
- FIXED FIGURES
----------------------------------*/

/** A 429 whose `Retry-After` is at most this many seconds is retried once; a longer wait is told to the assistant. */
export const RETRY_AFTER_MAX_SECONDS = 5;

/** The request body limit of the HTTP transport (plan section 2). */
export const HTTP_BODY_LIMIT_BYTES = 1024 * 1024;
