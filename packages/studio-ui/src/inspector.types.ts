import type { FieldNode } from "@nubbin/core";

/** One schema field with the draft's current value beneath it — what `ReadOnlyField`
 * renders, whether Puck's read-only custom field hands it over or a test builds one. */
export interface InspectorField extends FieldNode {
  value: unknown;
}
