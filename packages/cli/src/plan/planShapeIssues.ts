import type { StandardSchemaV1 } from "@standard-schema/spec";
import { isPlanFieldValid } from "./isPlanFieldValid";
import type { Plan } from "./plan.types";
import { PLAN_FIELDS } from "./planFields.constants";

/**
 * Every field of a candidate value that is not a legal answer, as Standard Schema issues.
 *
 * Reported per field rather than as one refusal: a questionnaire marks the answer that is wrong,
 * and a single "invalid plan" gives it nothing to point at.
 */
export function planShapeIssues(value: unknown): StandardSchemaV1.Issue[] {
  if (typeof value !== "object" || value === null) {
    return [{ message: "Expected an object carrying every plan field." }];
  }
  const record = value as Record<string, unknown>;
  return Object.entries(PLAN_FIELDS)
    .filter(([field]) => !isPlanFieldValid(field as keyof Plan, record[field]))
    .map(([field, options]) => ({
      message: `Expected one of: ${options.join(", ")}.`,
      path: [field],
    }));
}
