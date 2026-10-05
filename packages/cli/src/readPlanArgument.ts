import { isPlanCode } from "./isPlanCode";
import { parsePlanJson } from "./parsePlanJson";
import { decodePlan } from "./plan/decodePlan";
import type { Plan } from "./plan/plan.types";
import { readPlanText } from "./readPlanText";
import { UsageError } from "./UsageError";
import { validatePlan } from "./validatePlan";

/**
 * The plan an argument names: a code, decoded; or anything else, read as a JSON file relative to
 * the working directory and judged by the plan schema. The shape decides which, so a mistyped
 * code is refused as a code rather than searched for as a file called `v1-…`.
 */
export async function readPlanArgument(cwd: string, argument: string): Promise<Plan> {
  if (isPlanCode(argument)) {
    const plan = decodePlan(argument);
    if (plan === null) throw new UsageError(`not a plan code: ${argument}`);
    return plan;
  }
  return validatePlan(argument, parsePlanJson(argument, await readPlanText(cwd, argument)));
}
