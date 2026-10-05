import { formatOwnership } from "./formatOwnership";
import { formatStep } from "./formatStep";
import { deriveOwnership } from "./plan/deriveOwnership";
import { deriveSteps } from "./plan/deriveSteps";
import { describePlan } from "./plan/describePlan";
import type { Plan } from "./plan/plan.types";

/** Steps are numbered for a person, who counts from one. */
const FIRST_POSITION = 1;

/**
 * A consistent plan as the terminal prints it: the description, the ownership split, then the
 * numbered steps. Every line is a projection the website also renders, so a person who brought a
 * code from the questionnaire reads the plan they answered for, in the same words.
 */
export function formatPlan(plan: Plan): string[] {
  return [
    describePlan(plan),
    ...formatOwnership(deriveOwnership(plan)),
    ...deriveSteps(plan).flatMap((step, index) => formatStep(step, index + FIRST_POSITION)),
  ];
}
