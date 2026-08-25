/**
 * The draft's value at a compiler issue's dotted path — `cta.label`, `items.0.title` — read
 * segment by segment, with a numeric segment indexing an array the same way it indexes an
 * object. A path the props do not hold answers `undefined` rather than throwing, because
 * the caller is translating an issue, not asserting one.
 */
export function propAtPath(props: unknown, path: string): unknown {
  let value = props;
  for (const segment of path.split(".")) {
    if (typeof value !== "object" || value === null) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[segment];
  }
  return value;
}
