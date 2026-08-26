import type { FieldNode } from "@nubbin/core";
import { richTextFieldNodes } from "./richTextFieldNodes";
import { sameFieldNode } from "./sameFieldNode";

/** Whether a described array is `core`'s rich text: its descendants, rebased to the array,
 * match what `zodAdapter.describe` reports for `richText()` node for node. The projection
 * carries no marker, so the schema's own described shape is the identity — an extra field,
 * a different mark set or an added bound reads as an ordinary array instead. */
export function isRichTextField(field: FieldNode, fields: readonly FieldNode[]): boolean {
  if (field.kind !== "array") return false;
  const descendants = fields.filter((node) => node.path.startsWith(`${field.path}[]`));
  return (
    descendants.length === richTextFieldNodes.length &&
    descendants.every((node, index) => {
      const reference = richTextFieldNodes[index];
      if (reference === undefined) return false;
      return sameFieldNode({ ...node, path: node.path.slice(field.path.length) }, reference);
    })
  );
}
