/** The last segment of a described path — `cta.label` → `label`, `items[].name` → `name`,
 * a row shape's own `items[]` → `items` — which is both the prop key a nested value sits
 * under and the label a sub-field shows, in the same raw form the top-level inspector
 * labels its own fields with. */
export function leafFieldName(path: string): string {
  const leaf = path.split(".").pop() ?? path;
  return leaf.endsWith("[]") ? leaf.slice(0, -2) : leaf;
}
