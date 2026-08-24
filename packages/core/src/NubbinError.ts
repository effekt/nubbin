import type { NubbinIssue } from "./nubbinIssue.types";
import { summariseIssues } from "./summariseIssues";

// One class for the whole surface: a consumer writes one `catch`, reads `code` or `issues`, and
// ships that shape to whatever tooling they keep — the package neither logs nor decides what a
// refusal means to them.
/**
 * Every refusal Nubbin throws, from any package, carrying its causes as data rather than only as
 * prose. One `catch` and one `instanceof` hold the whole surface.
 *
 * It extends `Error`, so a handler that only ever read `.message` keeps working. `message`
 * summarises every cause: one issue reads as itself, several read as a count and a line each.
 *
 * @example
 * ```ts
 * import { NubbinError, NubbinIssueCode, compile } from "@nubbin/core";
 *
 * try {
 *   const { artifact } = compile(version, catalog, registry, "/pricing");
 *   await store.write(artifact);
 * } catch (error) {
 *   if (!(error instanceof NubbinError)) throw error;
 *
 *   if (error.code === NubbinIssueCode.InvalidRoute) {
 *     return rejectRoute(error.message);
 *   }
 *   for (const issue of error.issues) {
 *     editor.mark(issue.at, issue.path, issue.message);
 *   }
 * }
 * ```
 */
export class NubbinError extends Error {
  /**
   * The first issue's code, so the common case reads as
   * `error.code === NubbinIssueCode.UnknownProp` with no array to index and no string to typo.
   * Every refusal but `compile`'s carries exactly one issue; read `issues` for the rest.
   */
  readonly code: NubbinIssue["code"];
  /**
   * Every cause, in the order they were found, and never empty. This is what a log, a tracker or
   * an editing surface serializes — each issue carries its own `code`, `at` and `path`.
   */
  readonly issues: readonly NubbinIssue[];

  /**
   * @param issues - The causes, first one first. `code` is taken from `issues[0]` and `message`
   *   is a summary of all of them.
   * @throws {Error} A plain `Error`, not a `NubbinError`, when `issues` is empty — a refusal
   *   with no cause names nothing.
   */
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
