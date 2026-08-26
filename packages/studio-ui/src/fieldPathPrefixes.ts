/** Every prefix of a dotted Studio issue path, longest first — `stats.0.label` gives itself, then
 * `stats.0`, then `stats` — so a search for the field can fall back one container at a
 * time when the leaf's control is not in the DOM. */
export function fieldPathPrefixes(path: string): readonly string[] {
  const segments = path.split(".");
  return segments.map((_, index) => segments.slice(0, segments.length - index).join("."));
}
