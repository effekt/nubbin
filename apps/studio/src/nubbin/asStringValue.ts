/** A nested prop as the string a text control edits, or `undefined` when the draft holds
 * something else there — the control starts empty rather than coercing what it met. */
export function asStringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
