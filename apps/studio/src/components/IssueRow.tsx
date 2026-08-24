"use client";

import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { authorIssueSubject } from "../nubbin/authorIssueSubject";

interface IssueRowProps {
  issue: AuthorIssue;
  onGoTo: (issue: AuthorIssue) => void;
}

/** One thing to fix, as a dropdown row: a glyph the text speaks for, the place it lives —
 * `Hero — Headline` — the compiler's message in plain words, and the way there. The whole
 * issue rides the button so the handler can land on the field the path names, not just the
 * node. An issue naming no node has nowhere to go, so it carries no button. */
export function IssueRow({ issue, onGoTo }: IssueRowProps) {
  const subject = authorIssueSubject(issue);
  const { nodeId } = issue;
  return (
    <li className="nubbin-issues-row">
      <span aria-hidden="true">!</span>
      <span>
        {subject === undefined ? null : <span className="nubbin-issues-subject">{subject}: </span>}
        {issue.message}
      </span>
      {nodeId === undefined ? null : (
        <button type="button" onClick={() => onGoTo(issue)}>
          Go to it →
        </button>
      )}
    </li>
  );
}
