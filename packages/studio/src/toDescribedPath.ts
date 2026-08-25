/**
 * A compiler issue path in the form `zodAdapter.describe` uses: numeric segments — one
 * concrete array member — become the `[]` the field description addresses every member by,
 * so `items.0.title` looks up the same `FieldNode` as `items[].title`.
 */
export function toDescribedPath(path: string): string {
  return path
    .split(".")
    .map((segment) => (/^\d+$/.test(segment) ? "[]" : segment))
    .join(".")
    .replaceAll(".[]", "[]");
}
