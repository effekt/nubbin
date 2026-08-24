import type { NubbinIssueCode } from "./NubbinIssueCode";

// `code` is for branching and `message` is for reading — the prose says what a person needs and
// the code says what a program can act on, and neither is asked to do the other's job.
//
// `at` and `path` are two coordinates rather than one string because an editing surface needs
// both: `at` names the thing to select — a node, a block, a route — and `path` names where
// inside it to highlight. Joining them into prose would leave a studio parsing its own error
// messages to find the field an author has to fix.
/**
 * One reason Nubbin refused something. The shape every refusal takes, whether it arrives thrown
 * inside a `NubbinError` or returned in `CompileResult.issues`, so a consumer writes one handler
 * and serializes one thing.
 *
 * It is plain JSON: safe to log, store, or send across a wire without reshaping.
 *
 * @example Turn an issue into an editor selection
 * ```ts
 * function reveal(issue: NubbinIssue): void {
 *   if (issue.at !== undefined) editor.select(issue.at);
 *   if (issue.path !== undefined) editor.highlightField(issue.path);
 *   editor.explain(issue.message);
 * }
 * ```
 */
export interface NubbinIssue {
  /**
   * Which refusal this is. Branch on it against `NubbinIssueCode` — never on `message`, which is
   * prose and is reworded whenever a clearer wording is found.
   */
  code: NubbinIssueCode;
  /** Prose for a person, naming the specific value or id at fault. Not a stable contract. */
  message: string;
  /** What it concerns: a node id, a block name, or a route. Absent when nothing names it. */
  at?: string;
  /**
   * Where within that: a dotted prop path, `slots.items`, or `block`. Absent when the whole
   * subject is at fault rather than one place inside it.
   */
  path?: string;
}
