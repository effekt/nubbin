import { parseHttpJson } from "./parseHttpJson";
import type { RouteCreateOutcome } from "./routeCreateOutcome.types";

/** Judges the route-creation response before it reaches editor state. */
export function parseRouteCreateHttpReply(
  ok: boolean,
  status: number,
  body: string,
): RouteCreateOutcome {
  if (ok) {
    const parsed = parseHttpJson(body);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "route" in parsed &&
      typeof parsed.route === "string"
    ) {
      return { ok: true, route: parsed.route };
    }
  }
  return { ok: false, message: body === "" ? `the page was not created (${status})` : body };
}
