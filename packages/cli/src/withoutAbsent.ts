/**
 * Drops every key whose value is `undefined`. Under `exactOptionalPropertyTypes` an absent flag
 * has to be an absent property, not a property holding `undefined` — and spelling that as one
 * conditional spread per flag was the same sentence repeated once per flag.
 */
export function withoutAbsent<T extends Record<string, unknown>>(
  record: T,
): { [K in keyof T]?: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as {
    [K in keyof T]?: Exclude<T[K], undefined>;
  };
}
