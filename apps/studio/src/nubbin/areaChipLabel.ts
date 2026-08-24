/** What an area's fullness chip says: "n of max" where the slot declares a bound, plain
 * "n" where it does not — never a bound the schema did not claim. */
export function areaChipLabel(count: number, max: number | undefined): string {
  return max === undefined ? `${count}` : `${count} of ${max}`;
}
