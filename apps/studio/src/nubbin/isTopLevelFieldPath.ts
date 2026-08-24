/** Whether a described schema path names a component-level prop. Puck keys fields by prop
 * name, so only paths with no dot and no `[]` segment become fields; a deeper path is
 * covered by its top-level parent, which renders read-only with the whole value visible. */
export function isTopLevelFieldPath(path: string): boolean {
  return !path.includes(".") && !path.includes("[]");
}
