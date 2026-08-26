import type { CustomField } from "@measured/puck";
import type { FieldNode } from "@nubbin/core";
import { ReadOnlyField } from "./ReadOnlyField";

/** The Puck field for a kind without a single control — `array`, `object`, `union`,
 * `unknown`. A custom field whose render is the inspector's own `ReadOnlyField`, so the
 * author still sees the value as JSON; compile remains the judge of what it holds. */
export function toReadOnlyPuckField(field: FieldNode): CustomField<unknown> {
  return {
    type: "custom",
    label: field.path,
    render: ({ id, value }) => <ReadOnlyField id={id} field={{ ...field, value }} />,
  };
}
