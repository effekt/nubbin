/**
 * The visible text of one docs link: "Open in Figma" from the opaque key `figma`. The key is
 * capitalized and otherwise untouched — the consumer chose it, and the studio holds no table
 * of destinations to translate it against.
 */
export function toDocsLinkLabel(key: string): string {
  return `Open in ${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}
