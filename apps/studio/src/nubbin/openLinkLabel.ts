/** The Open affordance's accessible name: the destination it opens, spoken in full, so a
 * screen reader announcing three Open links in one fieldset says where each one goes. */
export function openLinkLabel(href: string): string {
  return `Open ${href} in a new tab`;
}
