"use client";

import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { authorIssueSubject } from "../nubbin/authorIssueSubject";

interface IssueRowProps {
  issue: AuthorIssue;
  onGoTo: (nodeId: string) => void;
}

/** One thing to fix, as a dropdown row: a glyph the text speaks for, the place it lives —
 * `Hero — Headline` — the compiler's message in plain words, and the way there. An issue
 * naming no node has nowhere to go, so it carries no button. */
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
        <button type="button" onClick={() => onGoTo(nodeId)}>
          Go to it →
        </button>
      )}
    </li>
  );
}
