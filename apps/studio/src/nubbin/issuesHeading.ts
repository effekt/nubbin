/**
 * The issues dropdown's title: how many things stand between this draft and going live,
 * grammatical at one as well as many.
 */
export function issuesHeading(count: number): string {
  return count === 1
    ? "1 thing needs fixing before this can go live"
    : `${count} things need fixing before this can go live`;
}
