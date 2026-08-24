import type { RouteCreateOutcome } from "./routeCreateOutcome.types";

/** The create-route endpoint's reply as an outcome: success echoes the route back off the
 * wire, and any refusal is its body text — an empty one still yields a line naming the
 * status, so no refusal is ever silent. */
export function parseRouteCreateReply(
  ok: boolean,
  status: number,
  body: string,
): RouteCreateOutcome {
  if (ok) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (typeof parsed === "object" && parsed !== null && "route" in parsed) {
        const { route } = parsed;
        if (typeof route === "string") {
          return { ok: true, route };
        }
      }
    } catch {
      // Not JSON — fall through to the refusal line below.
    }
  }
  return { ok: false, message: body === "" ? `the page was not created (${status})` : body };
}
