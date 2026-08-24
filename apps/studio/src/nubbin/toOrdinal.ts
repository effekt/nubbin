const CENTURY = 100;
const DECADE = 10;
const TEEN_FIRST = 11;
const TEEN_LAST = 13;
const SUFFIX_BY_LAST_DIGIT: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };

/** A count as English says it in a position line — `1st`, `2nd`, `3rd`, `4th` — with the
 * teens taking `th` the way `11th` and `112th` do. */
export function toOrdinal(count: number): string {
  const withinCentury = count % CENTURY;
  if (withinCentury >= TEEN_FIRST && withinCentury <= TEEN_LAST) {
    return `${count}th`;
  }
  return `${count}${SUFFIX_BY_LAST_DIGIT[count % DECADE] ?? "th"}`;
}
