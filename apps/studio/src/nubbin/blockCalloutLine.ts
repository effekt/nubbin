/**
 * The inspector callout for a selected block with issues: the count, then the reassurance —
 * edits persist, only going live waits. One string so the voice cannot drift from the design.
 */
export function blockCalloutLine(blockName: string, count: number): string {
  const things = count === 1 ? "1 thing" : `${count} things`;
  return `${blockName} has ${things} to fix. Your edits are saved — the page just can't go live until they're resolved.`;
}
