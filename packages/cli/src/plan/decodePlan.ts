import { parseNotifications } from "./parseNotifications";
import { parseOption } from "./parseOption";
import type { Plan } from "./plan.types";
import { CODE_LENGTH, SINGLE_CHARACTER, VERSION_PREFIX } from "./planCode.constants";
import { PLAN_FIELDS } from "./planFields.constants";

/**
 * The plan a code names, or `null` for a wrong prefix, a wrong length, or a character addressing
 * no option.
 *
 * Never throws: a code arrives from a URL a stranger typed, and a decoder that throws makes every
 * caller wrap it — so the refusal is a value the caller has to read.
 */
export function decodePlan(code: string): Plan | null {
  if (!code.startsWith(VERSION_PREFIX)) return null;
  const body = code.slice(VERSION_PREFIX.length);
  if (body.length !== CODE_LENGTH) return null;
  const decoded: Partial<Record<keyof Plan, unknown>> = {};
  let cursor = 0;
  for (const [field, options] of Object.entries(PLAN_FIELDS)) {
    const width = field === "notifications" ? options.length : SINGLE_CHARACTER;
    const chunk = body.slice(cursor, cursor + width);
    const value =
      field === "notifications" ? parseNotifications(chunk) : parseOption(chunk, options);
    if (value === null) return null;
    decoded[field as keyof Plan] = value;
    cursor += width;
  }
  return decoded as Plan;
}
