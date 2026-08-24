// Catch-all params to the route string artifacts and pointers are keyed by.
/**
 * Turns a Next catch-all param into the route string a store keys pointers and artifacts by.
 *
 * @param slug - The `slug` param of a `[...slug]` or `[[...slug]]` segment, as Next resolves it.
 *   `undefined` and the empty array both mean the root, which only the optional form matches.
 * @returns `"/"` for an absent or empty slug, and otherwise the segments joined with `/` under a
 *   leading slash. Segments pass through as Next handed them over — nothing is encoded, trimmed
 *   or lower-cased, so the string matches the route `compile` stamped on the artifact only when
 *   the document was published under the same spelling.
 * @example
 * ```ts
 * routeFromSlug(undefined); // "/"
 * routeFromSlug([]); // "/"
 * routeFromSlug(["promotions", "summer"]); // "/promotions/summer"
 * ```
 */
export function routeFromSlug(slug: readonly string[] | undefined): string {
  if (!slug || slug.length === 0) {
    return "/";
  }
  return `/${slug.join("/")}`;
}
