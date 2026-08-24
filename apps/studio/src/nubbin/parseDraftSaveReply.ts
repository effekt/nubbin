import { toIssueLine } from "./toIssueLine";

/** The draft endpoint's JSON reply as what the editor shows: `undefined` when the save
 * compiled clean, or the compiler's issues as lines when it refused — the draft is kept
 * either way, publish is the gate. A reply that is not the contract's shape becomes one
 * line saying so, since a silent `undefined` would read as a clean compile. */
export function parseDraftSaveReply(body: unknown): readonly string[] | undefined {
  if (typeof body !== "object" || body === null || !("ok" in body)) {
    return ["the draft endpoint answered with an unrecognised reply"];
  }
  if (body.ok === true) {
    return undefined;
  }
  const issues = "issues" in body && Array.isArray(body.issues) ? body.issues : [];
  return issues.map(toIssueLine);
}
