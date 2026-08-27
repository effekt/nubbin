import type { Plan } from "./plan.types";
import { PLAN_FIELDS } from "./planFields.constants";

/**
 * True when a value is a legal answer for a plan field.
 *
 * `notifications` is the one field that answers with a set, so it is checked as a subset of its
 * options rather than as a member of them. The members are re-typed before the walk because
 * `Array.isArray` narrows an unknown to `any[]`, which would carry an implicit any into the
 * predicate.
 */
export function isPlanFieldValid(field: keyof Plan, value: unknown): boolean {
  const allowed: readonly string[] = PLAN_FIELDS[field];
  if (field !== "notifications") return typeof value === "string" && allowed.includes(value);
  if (!Array.isArray(value)) return false;
  const members: readonly unknown[] = value;
  return members.every((one) => typeof one === "string" && allowed.includes(one));
}
