/**
 * What a thrown value says, whether or not it is an `Error`. A `throw "string"` from a consumer's
 * config or a parser's `SyntaxError` both reach the terminal through this, so neither prints as
 * `[object Object]` or `undefined`.
 */
export const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
