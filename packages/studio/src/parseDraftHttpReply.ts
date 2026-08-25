/** Judges the draft endpoint reply without treating compile issues as a lost save. */
export function parseDraftHttpReply(body: unknown): readonly unknown[] | undefined {
  if (typeof body !== "object" || body === null || !("ok" in body)) {
    return [{ message: "the draft endpoint answered with an unrecognised reply" }];
  }
  if (body.ok === true) return undefined;
  return "issues" in body && Array.isArray(body.issues) ? body.issues : [];
}
