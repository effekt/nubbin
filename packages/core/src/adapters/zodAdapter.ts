import type { FieldNode, SchemaAdapter } from "../field.types";
import { projectJsonSchema } from "./projectJsonSchema";
import { walkJsonSchema } from "./walkJsonSchema";

// Reads a schema entirely through the Standard JSON Schema converter the schema itself carries —
// `core` imports nothing from zod to do it. Validation never runs against this projection; it
// always runs `schema["~standard"].validate()` on the real schema.
/**
 * The shipped `SchemaAdapter` — what `defineCatalog` resolves hint paths through, exported so an
 * editing surface can describe a block's fields without loading the block's component.
 *
 * It is named for the reference validator but reads any schema exposing the Standard JSON Schema
 * converter, `richText()` included.
 *
 * @example
 * ```ts
 * zodAdapter.describe(z.object({ title: z.string(), draft: z.boolean().optional() }));
 * // [
 * //   { path: "title", kind: "string", optional: false },
 * //   { path: "draft", kind: "boolean", optional: true },
 * // ]
 *
 * zodAdapter.describe(z.object({ items: z.array(z.object({ title: z.string() })) }))
 *   .map((field) => field.path);
 * // ["items", "items[]", "items[].title"]
 *
 * zodAdapter.describe(z.object({ tone: z.enum(["light", "dark"]) }));
 * // [{ path: "tone", kind: "enum", optional: false, members: ["light", "dark"] }]
 * ```
 */
export const zodAdapter: SchemaAdapter = {
  /**
   * Every addressable path in a schema, as the field tree an editing surface renders.
   *
   * @param schema - The schema to read. It must expose the Standard JSON Schema converter —
   *   `~standard.jsonSchema` — which the spec has carried since 1.1.
   * @returns One `FieldNode` per path, parent before child: dotted for object properties, `path[]`
   *   for an array's row shape, and a union's branch fields under the union's own path. The root
   *   has no entry. A path two union branches share is reported once, keeping the first kind seen.
   * @throws {NubbinError} `no-json-schema` when the schema exposes no converter.
   * @throws The converter's own error when the schema holds a type JSON Schema cannot represent —
   *   `z.date()`, for one. It is asked to throw rather than degrade, so an unrepresentable field
   *   fails at registration instead of arriving in the studio as a string field.
   */
  describe(schema: unknown): FieldNode[] {
    const fields = walkJsonSchema(projectJsonSchema(schema), "");
    const seen = new Set<string>();
    return fields.filter((field) => {
      if (seen.has(field.path)) return false;
      seen.add(field.path);
      return true;
    });
  },
};
