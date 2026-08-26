/** The list with one item moved from one index to another, as a new array. An index off
 * either end moves nothing — a drop that missed should not scramble the rows. */
export function withItemMoved<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  if (from < 0 || from >= next.length || to < 0 || to >= next.length) return next;
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}
