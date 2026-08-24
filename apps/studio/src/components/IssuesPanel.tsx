"use client";

import type { AuthorIssue } from "../nubbin/authorIssue.types";
import { authorIssueLine } from "../nubbin/authorIssueLine";

interface IssuesPanelProps {
  heading: string;
  issues: readonly AuthorIssue[];
  onSelect: (nodeId: string) => void;
}

/**
 * The refusal, in author words, above the canvas: one line per issue, and an issue naming a
 * node is a button that selects that node in the editor — the failing block is on screen,
 * so the fix's front door is one click. An issue naming no node is plain text, since there
 * is nothing to go to.
 */
export function IssuesPanel({ heading, issues, onSelect }: IssuesPanelProps) {
  return (
    <section aria-labelledby="author-issues-heading" className="bg-canvas px-4 py-2 text-marine">
      <h2 id="author-issues-heading" className="font-semibold text-sm">
        {heading}
      </h2>
      <ul className="list-disc pl-5 text-sm">
        {issues.map((issue) => {
          const line = authorIssueLine(issue);
          const { nodeId } = issue;
          return (
            <li key={`${nodeId ?? ""}:${line}`}>
              {nodeId === undefined ? (
                line
              ) : (
                <button
                  type="button"
                  className="text-left underline underline-offset-4 focus:outline-none focus-visible:ring-2"
                  onClick={() => onSelect(nodeId)}
                >
                  {line}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
