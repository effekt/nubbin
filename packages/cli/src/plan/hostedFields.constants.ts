import type { Plan } from "./plan.types";

/**
 * The six fields naming a service Nubbin can run.
 *
 * `operations` is deliberately absent: someone can pay Nubbin to operate infrastructure they own,
 * which is why eligibility treats it separately from the services Nubbin hosts.
 */
export const HOSTED_FIELDS = [
  "studio",
  "drafts",
  "publishing",
  "artifacts",
  "delivery",
  "assets",
] as const satisfies readonly (keyof Plan)[];
