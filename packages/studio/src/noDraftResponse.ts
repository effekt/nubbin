/** Answers that a host has no draft for the requested route. */
export function noDraftResponse(route: string, status: number): Response {
  return new Response(`no draft for ${route}`, { status });
}
