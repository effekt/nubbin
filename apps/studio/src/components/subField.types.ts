import type { ComponentType } from "react";
import type { HintedFieldNode } from "../nubbin/hintedField.types";

/** What one nested control receives: the described field it edits, the whole description
 * so a container can find its children, and the value with its write-back. */
export interface SubFieldProps {
  field: HintedFieldNode;
  fields: readonly HintedFieldNode[];
  id: string;
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown) => void;
}

/** The recursion, injected: a repeater or fieldset renders each child through this rather
 * than importing the dispatcher, the same way `core`'s walkers take a `Descend` — so the
 * files never import each other in a cycle. */
export type SubFieldRender = ComponentType<SubFieldProps>;
