import type { StandardSchemaV1 } from "@standard-schema/spec";
import { isStandardSchema } from "./isStandardSchema";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";

/**
 * Runs the real schema's `validate()` — never the JSON Schema projection. Compile and
 * registration are synchronous by design, so a validator that answers with a promise is
 * refused loudly rather than awaited.
 */
export function standardValidate(
  schema: unknown,
  value: unknown,
): StandardSchemaV1.Result<unknown> {
  if (!isStandardSchema(schema)) {
    refuse(
      NubbinIssueCode.NotStandardSchema,
      "Schema does not implement Standard Schema (`~standard.validate`)",
    );
  }
  const result = schema["~standard"].validate(value);
  if (result instanceof Promise) {
    refuse(
      NubbinIssueCode.NotStandardSchema,
      "Schema validates asynchronously; compile and registration require synchronous validation",
    );
  }
  return result;
}
