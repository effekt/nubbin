import { PLAN_FIELDS } from "./planFields.constants";

/** What every plan code starts with. A code from a later revision decodes to nothing, not to a guess. */
export const VERSION_PREFIX = "v1-";

/** Enum position → character. Position `a` is the first option a field declares. */
export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/** A notification the plan carries. */
export const PRESENT = "1";

/** A notification the plan leaves out. */
export const ABSENT = "0";

/** Every field but `notifications` spends exactly one character. */
export const SINGLE_CHARACTER = 1;

/** One character per field, except `notifications`, which spends one per option. */
export const CODE_LENGTH =
  Object.keys(PLAN_FIELDS).filter((field) => field !== "notifications").length +
  PLAN_FIELDS.notifications.length;
