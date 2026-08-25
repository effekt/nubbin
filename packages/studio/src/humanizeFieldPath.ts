/**
 * A schema path as a label an author reads: `headline` → `Headline`, `cta.label` →
 * `Cta label`, camelCase split into words. Call it only for a path a lookup resolved —
 * an unresolved path stays raw so the author can quote it verbatim in a bug report.
 */
export function humanizeFieldPath(path: string): string {
  const words = path
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter((word) => word !== "")
    .map((word) => word.toLowerCase());
  const joined = words.join(" ");
  return joined === "" ? path : joined.charAt(0).toUpperCase() + joined.slice(1);
}
