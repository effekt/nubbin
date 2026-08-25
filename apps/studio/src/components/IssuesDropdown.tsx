"use client";

import type { AuthorIssue } from "@nubbin/studio";
import { issuesHeading } from "../nubbin/issuesHeading";
import { IssueRow } from "./IssueRow";

interface IssuesDropdownProps {
  issues: readonly AuthorIssue[];
  onGoTo: (issue: AuthorIssue) => void;
}

/** The pill's panel: what stands between the draft and going live, one row each, and the
 * reassurance the design insists on — the work is safe, only publishing waits. It wears the
 * publish panel's floating-card class so the header's two dropdowns are one design. */
export function IssuesDropdown({ issues, onGoTo }: IssuesDropdownProps) {
  return (
    <div className="nubbin-history">
      <h2>{issuesHeading(issues.length)}</h2>
      <ul>
        {issues.map((issue) => (
          <IssueRow
            key={`${issue.nodeId ?? ""}:${issue.fieldLabel ?? ""}:${issue.message}`}
            issue={issue}
            onGoTo={onGoTo}
          />
        ))}
      </ul>
      <p className="nubbin-issues-footer">
        Your work is saved as-is. Publishing just waits until these are fixed — nothing is lost, and
        nothing goes live by accident.
      </p>
    </div>
  );
}
