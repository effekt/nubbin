import type { FieldNode } from "@nubbin/core";

/** The fields one level beneath a base path — `cta` yields `cta.label`, `items[]` yields
 * `items[].name` — leaving deeper descendants to the recursion that renders each child. */
export function directChildFields(fields: readonly FieldNode[], basePath: string): FieldNode[] {
  const prefix = `${basePath}.`;
  return fields.filter((field) => {
    if (!field.path.startsWith(prefix)) return false;
    const rest = field.path.slice(prefix.length);
    return !rest.includes(".") && !rest.includes("[");
  });
}
