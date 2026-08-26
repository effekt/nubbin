/** Why the remove control is disabled, in the same voice as `holdsAtMostLine`: the lower
 * bound, stated as what the list needs rather than what the author did wrong. */
export function needsAtLeastLine(min: number): string {
  return `This list needs at least ${min}.`;
}
