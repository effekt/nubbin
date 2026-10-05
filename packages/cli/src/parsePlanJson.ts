import { messageOf } from "./messageOf";
import { UsageError } from "./UsageError";

/**
 * A plan file's text as a value, judged nowhere here — the schema judges it next. Only the parse
 * is this unit's, so the refusal names the file and carries the parser's reason, which says where
 * the text stopped being JSON.
 */
export function parsePlanJson(argument: string, text: string): unknown {
  try {
    const value: unknown = JSON.parse(text);
    return value;
  } catch (error) {
    throw new UsageError(`${argument} is not JSON: ${messageOf(error)}`);
  }
}
