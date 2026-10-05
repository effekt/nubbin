/**
 * A list for a line of prose, or the word `nothing` for an empty one. An empty join would leave
 * `Nubbin runs:` trailing into blank space, which reads as a line cut short rather than as the
 * answer it is.
 */
export const joinOrNothing = (items: readonly string[]): string =>
  items.length === 0 ? "nothing" : items.join(", ");
