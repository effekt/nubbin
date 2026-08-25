import type { AuthorIssue } from "./authorIssue.types";

/** The host-owned rollback operation's transport-independent result. */
export type RollbackOutcome =
  | { readonly status: "rolled-back"; readonly hash: string; readonly url: string }
  | { readonly status: "missing"; readonly hash: string }
  | {
      readonly status: "route-mismatch";
      readonly hash: string;
      readonly artifactRoute: string;
      readonly requestedRoute: string;
    }
  | { readonly status: "refused"; readonly issues: readonly AuthorIssue[] };
