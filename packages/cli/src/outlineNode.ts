import type { DocumentVersion } from "@nubbin/core";

/** Two spaces per level: deep enough to read as nesting, shallow enough for a real document. */
const INDENT = "  ";

/**
 * One node and everything under it, as lines. Recursive rather than iterative because the shape
 * being printed is the shape being walked, and a node missing from `elements` is named rather
 * than skipped — a dangling child is exactly what a person runs this command to find.
 */
export function outlineNode(version: DocumentVersion, id: string, depth: number): string[] {
  const pad = INDENT.repeat(depth);
  const node = version.elements[id];
  if (node === undefined) return [`${pad}${id}  (missing from the document)`];
  const lines = [`${pad}${id}  ${node.block}`];
  for (const [slot, children] of Object.entries(node.slots ?? {})) {
    lines.push(`${pad}${INDENT}${slot}`);
    for (const child of children) lines.push(...outlineNode(version, child, depth + 2));
  }
  return lines;
}
