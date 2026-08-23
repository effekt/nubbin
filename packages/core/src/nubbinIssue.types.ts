import type { NubbinIssueCode } from "./NubbinIssueCode";

/**
 * One reason Nubbin refused something. The shape every refusal takes, whether it was thrown or
 * returned, so a consumer writes one handler and serializes one thing.
 *
 * `code` is for branching and `message` is for reading — the prose says what a person needs and
 * the code says what a program can act on, and neither is asked to do the other's job.
 *
 * `at` and `path` are two coordinates rather than one string because an editing surface needs
 * both: `at` names the thing to select — a node, a block, a route — and `path` names where
 * inside it to highlight. Joining them into prose would leave a studio parsing its own error
 * messages to find the field an author has to fix.
 */
export interface NubbinIssue {
  code: NubbinIssueCode;
  message: string;
  /** What it concerns: a node id, a block name, or a route. */
  at?: string;
  /** Where within that: a dotted prop path, `slots.items`, or `block`. */
  path?: string;
}
