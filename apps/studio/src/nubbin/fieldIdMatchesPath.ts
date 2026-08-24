/** Whether one rendered control's `id` or `name` attribute addresses a compiler path on a
 * node. Puck hands a field's control `${nodeId}_${fieldType}_${fieldName}`, and the
 * studio's nested controls append `_${segment}` per row index or child key — so the
 * attribute names a dotted path exactly when what follows the type segment is the path
 * with its dots as underscores. The type segment is skipped rather than known, because
 * the path alone cannot say whether Puck rendered `custom`, `text` or `select`. */
export function fieldIdMatchesPath(attribute: string, nodeId: string, path: string): boolean {
  const prefix = `${nodeId}_`;
  if (!attribute.startsWith(prefix)) {
    return false;
  }
  const rest = attribute.slice(prefix.length);
  const typeEnd = rest.indexOf("_");
  return typeEnd !== -1 && rest.slice(typeEnd + 1) === path.replaceAll(".", "_");
}
