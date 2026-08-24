/**
 * Judges a request body as a rollback ask — a route and the hash to point it back at, both
 * non-empty strings. The body crossed a network boundary, so the shape is checked rather
 * than trusted; anything else answers `undefined` for the endpoint to refuse as malformed.
 */
export function parseRollback(body: unknown): { route: string; hash: string } | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  const { route, hash } = body as Record<string, unknown>;
  if (typeof route !== "string" || route === "" || typeof hash !== "string" || hash === "") {
    return undefined;
  }
  return { route, hash };
}
