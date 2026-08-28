import { AUTHORING, PUBLISHED, READING } from "./describePlan.constants";
import type { Plan } from "./plan.types";

/**
 * The plan in two sentences: who authors where, then where published artifacts live and when the
 * application reads them.
 *
 * Written from tables rather than assembled clause by clause, because the four ownership
 * combinations do not share a grammar — "You run Studio and keep drafts" loses a pronoun that
 * "Nubbin runs Studio and you keep drafts" needs.
 */
export function describePlan(plan: Plan): string {
  const authoring = AUTHORING[`${plan.studio}-${plan.drafts}`];
  const published = PUBLISHED[`${plan.artifacts}-${plan.delivery}`];
  return `${authoring} ${published}, and your application reads them ${READING[plan.consumption]}.`;
}
