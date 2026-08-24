import type { ComponentConfig, Field } from "@measured/puck";
import type { Block, CatalogEntry } from "@nubbin/core";
import { zodAdapter } from "@nubbin/core";
import type { ComponentType } from "react";
import { isTopLevelFieldPath } from "./isTopLevelFieldPath";
import { toHintedFields } from "./toHintedFields";
import { toPuckField } from "./toPuckField";
import { toPuckRender } from "./toPuckRender";
import { toSlotField } from "./toSlotField";

/** One catalog block as Puck configures a component: fields read from the same `zodAdapter`
 * description the inspector used — schema stays the single source — one slot-typed field per
 * declared slot, defaults as `defaultProps` with every slot starting empty, and `render`
 * the demo's own component from the registry. The component is registered as `unknown`
 * because `core` never learns React; the studio knows its registry holds React components. */
export function toPuckComponentConfig(entry: CatalogEntry, block: Block): ComponentConfig {
  const fields: Record<string, Field> = {};
  const described = toHintedFields(zodAdapter.describe(entry.schema), entry.ui);
  for (const field of described) {
    if (isTopLevelFieldPath(field.path)) {
      fields[field.path] = toPuckField(field, described);
    }
  }
  const defaultProps: Record<string, unknown> = { ...entry.defaults };
  for (const [name, constraint] of Object.entries(block.slots)) {
    fields[name] = toSlotField(constraint);
    defaultProps[name] = [];
  }
  return {
    fields,
    defaultProps,
    render: toPuckRender(block.component as ComponentType<Record<string, unknown>>, [
      ...Object.keys(block.slots),
    ]),
  };
}
