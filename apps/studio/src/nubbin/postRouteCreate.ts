import { parseRouteCreateReply } from "./parseRouteCreateReply";
import type { RouteCreateOutcome } from "./routeCreateOutcome.types";

/** The client half of creating a page: the route posted as JSON to the studio's routes
 * endpoint. The route is judged server-side by core's own validator, so the form ships no
 * second copy of that judgment; the reply comes back as an outcome the form can show. */
export async function postRouteCreate(route: string): Promise<RouteCreateOutcome> {
  const response = await fetch("/api/routes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ route }),
  });
  return parseRouteCreateReply(response.ok, response.status, await response.text());
}
