import type { FieldNode } from "../field.types";
import type { JsonSchemaNode } from "./jsonSchema.types";
import { kindOfJsonSchema } from "./kindOfJsonSchema";

/** Builds the FieldNode for one schema node: members only when the kind is enum, the
 * schema's own `maxLength` only when a string declares one, and an array's own
 * `minItems`/`maxItems` only when it declares them. */
export function fieldNodeAt(path: string, node: JsonSchemaNode, optional: boolean): FieldNode {
  const kind = kindOfJsonSchema(node);
  if (kind === "enum" && Array.isArray(node.enum)) {
    return { path, kind, optional, members: node.enum.map(String) };
  }
  if (kind === "string" && typeof node.maxLength === "number") {
    return { path, kind, optional, maxLength: node.maxLength };
  }
  if (kind === "array") {
    const field: FieldNode = { path, kind, optional };
    if (typeof node.minItems === "number") field.minItems = node.minItems;
    if (typeof node.maxItems === "number") field.maxItems = node.maxItems;
    return field;
  }
  return { path, kind, optional };
}
