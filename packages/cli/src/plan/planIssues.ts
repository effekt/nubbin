import { isolatedNetworkIssues } from "./isolatedNetworkIssues";
import type { Plan } from "./plan.types";
import type { PlanIssue } from "./planIssue.types";

/**
 * Every combination of answers this plan holds that the product cannot deliver.
 *
 * Beside the schema rather than in a questionnaire, so the website and `nubbin init` refuse the
 * same plans. Paying Nubbin to operate infrastructure the customer owns is not one of them: every
 * service self-hosted with `operations: "nubbin"` is a supported arrangement, not a mistake.
 */
export function planIssues(plan: Plan): PlanIssue[] {
  const issues: PlanIssue[] = [];
  if (plan.delivery === "nubbin" && plan.artifacts === "self") {
    issues.push({ field: "artifacts", message: "Nubbin can only serve artifacts it stores." });
  }
  if (plan.consumption === "on-change" && plan.notifications.length === 0) {
    issues.push({
      field: "notifications",
      message: "Reacting to a change needs a notification to react to.",
    });
  }
  return [...issues, ...isolatedNetworkIssues(plan)];
}
