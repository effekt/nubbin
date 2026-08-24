import { NubbinError } from "./NubbinError";
import type { NubbinIssue } from "./nubbinIssue.types";

// `compile` is the exception and builds its own `NubbinError`, because it collects: an author
// fixing six problems should see six, not the first.
/**
 * Throws the one-cause refusal almost every Nubbin surface raises, in one line rather than
 * assembling an issue array around it.
 *
 * It is exported so a consumer's own adapter — a store, a schema adapter, a framework binding —
 * refuses in the shape core does, and a caller's single `catch (error) { if (error instanceof
 * NubbinError) … }` still holds everything.
 *
 * @param code - Which refusal this is, from `NubbinIssueCode`.
 * @param message - Prose for a person, naming the specific value or id at fault.
 * @param at - What the refusal concerns: a node id, a block name, or a route. Omit it and the
 *   issue carries no `at` key at all, rather than one set to `undefined`.
 * @returns Never. It always throws, so a caller needs no `return` after it for TypeScript's
 *   narrowing to hold past the call.
 * @throws {NubbinError} A `NubbinError` — always, carrying exactly one issue built from the
 *   arguments.
 *
 * @example An adapter refusing in the same shape core does
 * ```ts
 * import { NubbinIssueCode, refuse } from "@nubbin/core";
 * import type { Artifact } from "@nubbin/core";
 *
 * async function requireArtifact(hash: string): Promise<Artifact> {
 *   const stored = await store.read(hash);
 *   // `refuse` returns never, so `stored` is narrowed to Artifact below.
 *   if (stored === null) {
 *     refuse(NubbinIssueCode.ArtifactNotStored, `no artifact stored at ${hash}`, hash);
 *   }
 *   return stored;
 * }
 * ```
 */
export function refuse(code: NubbinIssue["code"], message: string, at?: string): never {
  throw new NubbinError([at === undefined ? { code, message } : { code, message, at }]);
}
