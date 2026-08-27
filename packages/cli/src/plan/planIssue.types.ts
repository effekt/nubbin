import type { Plan } from "./plan.types";

/**
 * A combination of answers the schema admits but the product cannot deliver, named against the
 * field a customer would change to resolve it.
 */
export type PlanIssue = {
  field: keyof Plan;
  message: string;
};
