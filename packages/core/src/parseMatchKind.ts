import type { RoutePointer } from "./artifact.types";
import { assertValidRoute } from "./assertValidRoute";

// matchKind is parsed from the route at publish, never caller-supplied. It lives in core so
// every adapter derives it from one implementation — a second parser is free to disagree.
//
// The route is judged before it is classified: this is the last point before a pointer is
// written, so an adapter that never called `compile` still cannot publish an unaddressable one.

/**
 * Derives the `matchKind` for a route pointer. An `ArtifactStore` implementation calls this
 * inside `publish` and puts the result on the pointer it writes, so the caller of `publish` never
 * supplies one.
 *
 * @param route - The route the pointer will address: rooted at `/`, no trailing slash except at
 * the root itself, `[bracketed]` param segments, and `*` only as the final segment.
 * @returns `"prefix"` for a route ending in `/*`, `"param"` for one carrying a `[bracketed]`
 * segment, and `"exact"` for anything else — `/` included.
 * @throws NubbinError with `code` `NubbinIssueCode.InvalidRoute` when the route is not
 * addressable: it does not start at `/`, it trails a slash, a segment is empty or carries a
 * character a URL path cannot, a bracketed segment names nothing, or `*` sits mid-route. The
 * `at` on the issue is the offending route.
 * @example
 * ```ts
 * import { parseMatchKind } from "@nubbin/core";
 *
 * parseMatchKind("/about"); // "exact"
 * parseMatchKind("/guides/[city]"); // "param"
 * parseMatchKind("/collections/*"); // "prefix"
 * parseMatchKind("pricing"); // throws NubbinError — a route starts at the root
 * ```
 */
export function parseMatchKind(route: string): RoutePointer["matchKind"] {
  assertValidRoute(route);
  if (route.endsWith("/*")) {
    return "prefix";
  }
  if (/\[[^/]+\]/.test(route)) {
    return "param";
  }
  return "exact";
}
