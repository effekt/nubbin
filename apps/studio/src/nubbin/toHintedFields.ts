import type { BlockUi, FieldNode } from "@nubbin/core";
import type { HintedFieldNode } from "@nubbin/studio-ui";

/** The described fields with each catalog `control` hint folded onto the node its path
 * names. Hints stay parallel to the schema by decision, so this is the one place the two
 * meet: every renderer downstream reads `field.control` instead of carrying the block's
 * `ui` beside the description. Paths without a hint pass through untouched. */
export function toHintedFields(
  described: readonly FieldNode[],
  ui: BlockUi | undefined,
): HintedFieldNode[] {
  return described.map((field) => {
    const control = ui?.fields?.[field.path]?.control;
    return control === undefined ? field : { ...field, control };
  });
}
