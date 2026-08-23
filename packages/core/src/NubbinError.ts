import type { NubbinIssue } from "./nubbinIssue.types";
import { summariseIssues } from "./summariseIssues";

/**
 * Every refusal Nubbin throws, carrying its causes as data rather than only as prose. One class
 * for the whole surface: a consumer writes one `catch`, reads `code` or `issues`, and ships that
 * shape to whatever tooling they keep — the package neither logs nor decides what a refusal
 * means to them.
 *
 * It extends `Error`, so a handler that only ever read `.message` keeps working.
 */
export class NubbinError extends Error {
  /**
   * The first issue's code, so the common case reads as
   * `error.code === NubbinIssueCode.UnknownProp` with no array to index and no string to typo.
   * Every refusal but `compile`'s carries exactly one issue; read `issues` for the rest.
   */
  readonly code: NubbinIssue["code"];
  readonly issues: readonly NubbinIssue[];

  constructor(issues: readonly NubbinIssue[]) {
    const first = issues[0];
    if (first === undefined) {
      throw new Error("NubbinError needs an issue — a refusal with no cause names nothing");
    }
    super(summariseIssues(issues));
    this.name = "NubbinError";
    this.code = first.code;
    this.issues = issues;
  }
}
