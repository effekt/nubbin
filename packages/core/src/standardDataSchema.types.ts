import type { StandardJSONSchemaV1, StandardSchemaV1 } from "@standard-schema/spec";

// A schema `core` hand-writes rather than one a validator brings. Narrower than
// `StandardSchemaV1` in the two ways that matter to a consumer hosting it: `validate` is
// synchronous, which compile requires anyway, and the JSON Schema converter is always there, so
// the studio can read the field tree without testing for it.
/**
 * A schema `core` writes itself, such as the one `richText()` returns. It satisfies both
 * `StandardSchemaV1` and `StandardJSONSchemaV1`, so a block, a catalog entry or an adapter takes
 * it wherever either is accepted — while guaranteeing two things the interfaces leave open.
 *
 * @typeParam Value - What a successful `validate` yields, and so what a component receives for
 *   the field.
 */
export interface StandardDataSchema<Value> {
  /** The Standard Schema entry point. Everything a consumer reads about the schema is here. */
  readonly "~standard": {
    /** The Standard Schema version this shape speaks. */
    readonly version: 1;
    /** Who wrote the schema, for a tool reporting where a field's rules came from. */
    readonly vendor: string;
    /**
     * Checks a value, synchronously — never a promise, which is what `compile` requires of any
     * schema it runs. A refusal comes back as `issues` on the result rather than as a throw.
     */
    readonly validate: (value: unknown) => StandardSchemaV1.Result<Value>;
    /**
     * The JSON Schema projection, present rather than optional — what `zodAdapter.describe`
     * walks to reach the field tree an editing surface renders.
     */
    readonly jsonSchema: StandardJSONSchemaV1.Converter;
  };
}
