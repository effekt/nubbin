import type { FieldNode } from "../field.types";
import type { JsonSchemaNode } from "./jsonSchema.types";
import { kindOfJsonSchema } from "./kindOfJsonSchema";

/** Builds the FieldNode for one schema node: members only when the kind is enum, the
 * schema's own `maxLength` only when a string declares one. */
export function fieldNodeAt(path: string, node: JsonSchemaNode, optional: boolean): FieldNode {
  const kind = kindOfJsonSchema(node);
  if (kind === "enum" && Array.isArray(node.enum)) {
    return { path, kind, optional, members: node.enum.map(String) };
  }
  if (kind === "string" && typeof node.maxLength === "number") {
    return { path, kind, optional, maxLength: node.maxLength };
  }
  return { path, kind, optional };
}
