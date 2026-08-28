import type { Plan } from "./plan.types";
import { ABSENT, ALPHABET, PRESENT, VERSION_PREFIX } from "./planCode.constants";
import { PLAN_FIELDS } from "./planFields.constants";

/**
 * The plan as a reversible code: `v1-` and one character per field, in schema order.
 *
 * Reversible rather than hashed, because the parties that need to read a code — a URL, a portal
 * record, `nubbin init` — share no storage to invert a hash against. The code is its own table.
 */
export function encodePlan(plan: Plan): string {
  const characters = (Object.keys(PLAN_FIELDS) as (keyof Plan)[]).map((field) => {
    if (field === "notifications") {
      return PLAN_FIELDS.notifications
        .map((option) => (plan.notifications.includes(option) ? PRESENT : ABSENT))
        .join("");
    }
    const allowed: readonly string[] = PLAN_FIELDS[field];
    return ALPHABET.charAt(allowed.indexOf(plan[field]));
  });
  return `${VERSION_PREFIX}${characters.join("")}`;
}
