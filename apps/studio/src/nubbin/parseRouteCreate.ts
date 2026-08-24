/** Checks an untrusted create-route body for the one field it carries — `undefined` over a
 * throw, so the endpoint answers a malformed body with its own status. Whether the string
 * is an addressable route is core's judgment, not this one's. */
export function parseRouteCreate(body: unknown): { route: string } | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  const { route } = body as Record<string, unknown>;
  return typeof route === "string" ? { route } : undefined;
}
