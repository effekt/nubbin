/** A compiler issue path with emptiness folded away: the compiler joins an absent Standard
 * Schema path into `""`, and every consumer here treats that the same as no path at all. */
export function nonEmptyPath(path: string | undefined): string | undefined {
  return path === "" ? undefined : path;
}
