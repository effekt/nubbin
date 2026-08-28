import type { Plan } from "./plan.types";
import { ABSENT, PRESENT } from "./planCode.constants";
import { PLAN_FIELDS } from "./planFields.constants";

/**
 * The notifications a run of present/absent characters names, or `null` when a character is
 * neither.
 */
export function parseNotifications(chunk: string): Plan["notifications"] | null {
  const options = PLAN_FIELDS.notifications;
  const flags = [...chunk];
  if (flags.length !== options.length) return null;
  if (flags.some((flag) => flag !== PRESENT && flag !== ABSENT)) return null;
  return options.filter((_, index) => flags[index] === PRESENT);
}
