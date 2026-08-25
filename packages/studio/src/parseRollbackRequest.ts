/** Checks an untrusted rollback body for a non-empty route and artifact hash. */
export function parseRollbackRequest(body: unknown): { route: string; hash: string } | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const { route, hash } = body as Record<string, unknown>;
  if (typeof route !== "string" || route === "" || typeof hash !== "string" || hash === "") {
    return undefined;
  }
  return { route, hash };
}
