/** Checks the untrusted route-creation body. Core remains the authority over route validity. */
export function parseRouteCreateRequest(body: unknown): { route: string } | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const { route } = body as Record<string, unknown>;
  return typeof route === "string" ? { route } : undefined;
}
