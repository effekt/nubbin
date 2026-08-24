import { prefixedRoute } from "./prefixedRoute";

/** Navigation as a unit: send the browser to a route's editor. A full navigation on
 * purpose — the edit page is `force-dynamic` and re-reads the draft on the server, which a
 * client-side transition would have to re-plumb. */
export function goToEditor(route: string): void {
  window.location.assign(prefixedRoute("/edit", route));
}
