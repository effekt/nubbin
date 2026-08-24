/** The draft endpoint's JSON reply as what the editor translates: `undefined` when the save
 * compiled clean, or the compiler's issues still raw off the wire when it refused — the
 * draft is kept either way, publish is the gate. A reply that is not the contract's shape
 * becomes one issue saying so, since a silent `undefined` would read as a clean compile. */
export function parseDraftSaveReply(body: unknown): readonly unknown[] | undefined {
  if (typeof body !== "object" || body === null || !("ok" in body)) {
    return [{ message: "the draft endpoint answered with an unrecognised reply" }];
  }
  if (body.ok === true) {
    return undefined;
  }
  return "issues" in body && Array.isArray(body.issues) ? body.issues : [];
}
