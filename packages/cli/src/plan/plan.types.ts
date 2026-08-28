import type { PLAN_FIELDS } from "./planFields.constants";

/**
 * The option table's own type — the field order and the values each field accepts.
 *
 * Exported because a questionnaire renders from it: a consumer that re-declared the fields would
 * hold the second copy of the table `PLAN_FIELDS` exists to be the only one of.
 */
export type PlanFields = typeof PLAN_FIELDS;

/**
 * The architecture plan: twelve closed answers describing what a customer owns and what Nubbin
 * supplies.
 *
 * Inferred from `PLAN_FIELDS` rather than declared beside it, so a field's type and the options a
 * questionnaire renders cannot drift apart. `notifications` is the one repeated field — a plan may
 * react to a publish in several ways at once.
 */
export type Plan = {
  -readonly [Field in keyof PlanFields]: Field extends "notifications"
    ? PlanFields[Field][number][]
    : PlanFields[Field][number];
};

/**
 * How a field is asked about, and what each of its values is called.
 *
 * Mapped over `PlanFields` rather than written as a loose record, so a field added to the table
 * fails to compile until it has a question, and a value added to a field fails until it has a
 * label. A `Record<string, …>` would accept both and go out unasked.
 */
export type PlanPrompts = {
  [Field in keyof PlanFields]: {
    question: string;
    options: Record<PlanFields[Field][number], string>;
  };
};
