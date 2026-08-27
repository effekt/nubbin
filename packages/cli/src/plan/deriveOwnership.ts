import { HOSTED_FIELDS } from "./hostedFields.constants";
import type { Plan } from "./plan.types";
import { PLAN_LABELS } from "./planLabels.constants";

const SPLIT_FIELDS = [...HOSTED_FIELDS, "operations"] as const;

/** What each party runs, as two lists a page can put side by side. */
export type Ownership = {
  you: string[];
  nubbin: string[];
};

/**
 * The ownership split a plan describes.
 *
 * The application and the components are always the customer's: they are the two things Nubbin
 * cannot host without becoming the hosted CMS this project is a reaction to.
 */
export function deriveOwnership(plan: Plan): Ownership {
  const you = [PLAN_LABELS.application, PLAN_LABELS.components];
  const nubbin: string[] = [];
  for (const field of SPLIT_FIELDS) {
    (plan[field] === "nubbin" ? nubbin : you).push(PLAN_LABELS[field]);
  }
  return { you, nubbin };
}
