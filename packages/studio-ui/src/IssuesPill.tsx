"use client";

import type { PuckApi } from "@measured/puck";
import { type AuthorIssue, patchEditorStatus } from "@nubbin/studio";
import type { RefObject } from "react";
import { useCallback, useRef } from "react";
import "./issuesFlow.css";
import { focusIssueField } from "./focusIssueField";
import { IssuesDropdown } from "./IssuesDropdown";
import { inspectorBody } from "./inspectorBody";
import { selectPuckNode } from "./selectPuckNode";
import { useDismissiblePopup } from "./useDismissiblePopup";
import { useEditorStatus } from "./useEditorStatus";

type IssuesPillProps = {
  apiRef: RefObject<(() => PuckApi) | undefined>;
};

/** The header's amber pill, present exactly while the draft has issues: `Fix N issues` with
 * the count badged, toggling the dropdown that lists them. It reads everything through the
 * status store, so the overrides that render it never change identity — a publish refusal
 * opens it from the editor's side through the same store. Going to an issue selects the
 * failing node in Puck, lands focus on the field its path names once the inspector has
 * rendered it, and closes the panel — the fix is one keystroke away, per the wireframes. */
export function IssuesPill({ apiRef }: IssuesPillProps) {
  const { issues, issuesOpen } = useEditorStatus();
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const dismiss = useCallback(() => patchEditorStatus({ issuesOpen: false }), []);
  useDismissiblePopup(issuesOpen, rootRef, pillRef, dismiss);
  if (issues.length === 0) {
    return null;
  }
  const goTo = (issue: AuthorIssue) => {
    const api = apiRef.current;
    const { nodeId } = issue;
    if (api !== undefined && nodeId !== undefined && selectPuckNode(api(), nodeId)) {
      void focusIssueField(inspectorBody(document), nodeId, issue.path);
    }
    patchEditorStatus({ issuesOpen: false });
  };
  return (
    <div ref={rootRef} className="nubbin-issues">
      <button
        type="button"
        ref={pillRef}
        className="nubbin-issues-pill"
        aria-expanded={issuesOpen}
        onClick={() => patchEditorStatus({ issuesOpen: !issuesOpen })}
      >
        Fix <span className="nubbin-issues-count">{issues.length}</span>{" "}
        {issues.length === 1 ? "issue" : "issues"}
      </button>
      {issuesOpen ? <IssuesDropdown issues={issues} onGoTo={goTo} /> : null}
    </div>
  );
}
