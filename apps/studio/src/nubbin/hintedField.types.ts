import type { FieldNode } from "@nubbin/core";

/** A described field with its catalog `control` hint folded in — what the studio's field
 * pipeline passes around, so a control choice travels with the node it names rather than
 * as a lookup every nested renderer would have to repeat. A plain `FieldNode` satisfies
 * it, since a field without a hint is a field rendered by kind. */
export interface HintedFieldNode extends FieldNode {
  /** The `control` name the block's `ui.fields` hint set for this path, when one did. */
  control?: string;
}
