import { HOSTED_FIELDS } from "./hostedFields.constants";
import type { Plan } from "./plan.types";
import type { PlanIssue } from "./planIssue.types";

/** The message every hosted service on an isolated network carries. */
const MESSAGE = "An isolated network reaches no Nubbin service.";

/**
 * One issue per Nubbin-hosted service a plan asks for on an isolated network.
 *
 * Per service rather than one issue against `network`: the customer picked each service
 * separately, and an issue naming the whole network leaves them to work out which answer to undo.
 */
export function isolatedNetworkIssues(plan: Plan): PlanIssue[] {
  if (plan.network !== "isolated") return [];
  return HOSTED_FIELDS.filter((field) => plan[field] === "nubbin").map((field) => ({
    field,
    message: MESSAGE,
  }));
}
