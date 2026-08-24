const SHORT_LENGTH = 8;

/** A content hash cut to its first eight characters — enough to tell rows apart in a panel,
 * while the full hash stays in the data for anything that resolves it. */
export function shortHash(hash: string): string {
  return hash.slice(0, SHORT_LENGTH);
}
