import type { PLAN_FIELDS } from "./planFields.constants";

type PlanOptions = typeof PLAN_FIELDS;

/**
 * The architecture plan: twelve closed answers describing what a customer owns and what Nubbin
 * supplies.
 *
 * Inferred from `PLAN_FIELDS` rather than declared beside it, so a field's type and the options a
 * questionnaire renders cannot drift apart. `notifications` is the one repeated field — a plan may
 * react to a publish in several ways at once.
 */
export type Plan = {
  -readonly [Field in keyof PlanOptions]: Field extends "notifications"
    ? PlanOptions[Field][number][]
    : PlanOptions[Field][number];
};
