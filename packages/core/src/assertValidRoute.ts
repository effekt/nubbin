import { routeSegmentIssue } from "./routeSegmentIssue";

/**
 * The one place a route is judged, called by `compile` before a route reaches an artifact and by
 * `parseMatchKind` before one reaches a pointer. Until this existed nothing refused any string:
 * `""` and `"garbage"` both compiled, and both published as `exact`, so a typo became a live
 * pointer addressing a page no request could ever match.
 *
 * A trailing slash is refused rather than trimmed. Accepting both spellings would let `/pricing`
 * and `/pricing/` key two pointers at one page, and whichever published second would win by
 * accident.
 */
export function assertValidRoute(route: string): void {
  const refuse = (why: string): never => {
    throw new Error(`route "${route}" is not addressable: ${why}`);
  };
  if (!route.startsWith("/")) {
    refuse("a route starts at the root, with a slash");
  }
  if (route === "/") {
    return;
  }
  if (route.endsWith("/")) {
    refuse("a trailing slash would key a second pointer to one page");
  }
  const segments = route.slice(1).split("/");
  for (const [index, segment] of segments.entries()) {
    const issue = routeSegmentIssue(segment, index === segments.length - 1);
    if (issue !== undefined) {
      refuse(issue);
    }
  }
}
