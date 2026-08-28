import { HOSTED_FIELDS } from "./hostedFields.constants";
import type { Plan } from "./plan.types";

/** What a plan costs, to the resolution prices exist at: nothing, something, or a conversation. */
export type Eligibility = "free" | "paid" | "contact";

/**
 * Whether a plan is free, paid, or a conversation.
 *
 * By ownership rather than by a price table: prices do not exist yet, and the rule that a customer
 * running every service themselves owes nothing stays true when they do. Operating someone's own
 * infrastructure is a conversation rather than a price, because what it costs is what they run.
 */
export function deriveEligibility(plan: Plan): Eligibility {
  const isAnythingHosted = HOSTED_FIELDS.some((field) => plan[field] === "nubbin");
  if (plan.network !== "public") return "contact";
  if (plan.operations === "nubbin" && !isAnythingHosted) return "contact";
  return isAnythingHosted ? "paid" : "free";
}
