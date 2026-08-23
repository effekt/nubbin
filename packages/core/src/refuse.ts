import { NubbinError } from "./NubbinError";
import type { NubbinIssue } from "./nubbinIssue.types";

/**
 * Throws the one-cause refusal that almost every surface raises, so a site says what it refuses
 * and why in one line rather than assembling an issue array around it.
 *
 * `compile` is the exception and builds its own `NubbinError`, because it collects: an author
 * fixing six problems should see six, not the first.
 *
 * Returns `never`, so a caller need not `return` after it for the narrowing to hold.
 */
export function refuse(code: NubbinIssue["code"], message: string, at?: string): never {
  throw new NubbinError([at === undefined ? { code, message } : { code, message, at }]);
}
