import type { RoutePointer } from "./artifact.types";
import { assertValidRoute } from "./assertValidRoute";

/**
 * matchKind is parsed from the route at publish, never caller-supplied. It lives in core so
 * every adapter derives it from one implementation — a second parser is free to disagree.
 *
 * The route is judged before it is classified: this is the last point before a pointer is
 * written, so an adapter that never called `compile` still cannot publish an unaddressable one.
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
