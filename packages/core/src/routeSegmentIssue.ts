/** Every character a route segment may carry. Excludes whitespace and control characters by
 * construction rather than by testing for them, so an unlisted character is refused by default. */
const SEGMENT = /^[A-Za-z0-9\-._~%!$&'()+,;=:@]+$/;
/** A param segment names something: `[slug]`, never `[]`. */
const PARAM = /^\[[A-Za-z0-9_-]+\]$/;

/**
 * Why one route segment is unaddressable, or `undefined` when it is fine. A returned reason
 * rather than a throw, so `assertValidRoute` owns the message and this owns only the rule.
 */
export function routeSegmentIssue(segment: string, isLast: boolean): string | undefined {
  if (segment === "") {
    return "a segment names nothing";
  }
  if (segment === "*") {
    return isLast ? undefined : "a prefix star is only the final segment";
  }
  if (segment.startsWith("[") || segment.endsWith("]")) {
    return PARAM.test(segment) ? undefined : `"${segment}" is not a param segment`;
  }
  return SEGMENT.test(segment) ? undefined : `"${segment}" carries a character a route cannot`;
}
