import { formatSchemaIssue } from "./formatSchemaIssue";
import { planSchema } from "./plan/plan.schema";
import type { Plan } from "./plan/plan.types";
import { UsageError } from "./UsageError";

/**
 * A parsed value as a plan, judged by the same schema the questionnaire runs — so a file the
 * website would refuse is refused here for the same reasons. Every issue is listed beneath one
 * heading naming the file, because a person fixing a hand-edited plan fixes all of them at once.
 */
export async function validatePlan(argument: string, value: unknown): Promise<Plan> {
  const result = await planSchema["~standard"].validate(value);
  if (result.issues === undefined) return result.value;
  throw new UsageError(`${argument} is not a plan:`, result.issues.map(formatSchemaIssue));
}
