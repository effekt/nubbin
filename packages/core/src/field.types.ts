/**
 * What an editing surface renders a field as. `"unknown"` is the honest answer for a JSON
 * Schema node carrying no type an inspector can render — a field the studio shows read-only
 * rather than guessing at.
 *
 * - `"string"`, `"number"`, `"boolean"` — scalars; `integer` reports as `"number"`.
 * - `"enum"` — a closed set, whose members arrive on `FieldNode.members`.
 * - `"array"` — a list; the row shape is a separate `FieldNode` at `path[]`.
 * - `"object"` — a nested shape, whose own fields follow it in the result.
 * - `"union"` — one of several branches; each branch's fields are emitted under this path.
 */
export type FieldKind =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "array"
  | "object"
  | "union"
  | "unknown";

/** One addressable field of a schema, in the dotted form a hint key uses. */
export interface FieldNode {
  /** Dotted path from the schema root, with `[]` for array members: `cta.label`, `items[].title`. */
  path: string;
  /** What the field is, and so what an inspector renders for it. */
  kind: FieldKind;
  /** `true` when the schema does not require the field. An array's row shape is never optional. */
  optional: boolean;
  /** Present only for `enum`. */
  members?: readonly string[];
}

/** The contract for reading a schema's field structure — what `defineCatalog` resolves hint
 * paths through, and what an editing surface reads a block's fields from. */
export interface SchemaAdapter {
  /**
   * Describes every path a hint may target.
   *
   * @param schema - The schema to read. What counts as readable is the implementation's to
   *   decide; `zodAdapter` accepts anything exposing the Standard JSON Schema converter.
   * @returns One `FieldNode` per addressable path, parent before child. The schema root itself
   *   has no path and no entry, so the result is exactly the set of paths a hint may name.
   * @throws {NubbinError} Implementation-defined. `zodAdapter` refuses a schema with no
   *   converter as `no-json-schema`; the converter itself throws on a type JSON Schema cannot
   *   represent.
   */
  describe(schema: unknown): FieldNode[];
}
