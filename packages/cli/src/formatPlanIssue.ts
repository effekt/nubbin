import type { PlanIssue } from "./plan/planIssue.types";

/**
 * One plan issue as one line: the field a person would change, then why. A plan issue carries
 * no code — it is a combination of answers, not a fault in a document — so unlike a compile
 * refusal there is nothing for a script to branch on ahead of the prose.
 */
export function formatPlanIssue(issue: PlanIssue): string {
  return `${issue.field}: ${issue.message}`;
}
