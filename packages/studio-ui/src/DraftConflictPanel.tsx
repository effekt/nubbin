"use client";

import type { DocumentConflict } from "@nubbin/core";
import { ConflictValue } from "./ConflictValue";
import { ResolutionButton } from "./ResolutionButton";
import "./draftConflictPanel.css";

export interface DraftConflictPanelProps {
  readonly conflicts: readonly DocumentConflict[];
  readonly onResolve: (index: number, choice: "local" | "remote") => void;
}

/** Keeps both sides of every unresolved save conflict visible until the author chooses. */
export function DraftConflictPanel({ conflicts, onResolve }: DraftConflictPanelProps) {
  if (conflicts.length === 0) return null;
  return (
    <aside className="nb-conflicts" aria-labelledby="nb-conflicts-title">
      <h2 id="nb-conflicts-title">Changes need reconciliation</h2>
      <p>Another editor changed the same values. Choose what the next save keeps.</p>
      <ol>
        {conflicts.map((conflict, index) => (
          <li key={conflict.path.join(".")}>
            <strong>{conflict.path.join(".")}</strong>
            <div className="nb-conflict-values">
              <ConflictValue label="Your value" value={conflict.local} />
              <ConflictValue label="Their value" value={conflict.remote} />
            </div>
            <div className="nb-conflict-actions">
              <ResolutionButton onClick={() => onResolve(index, "local")}>
                Keep mine
              </ResolutionButton>
              <ResolutionButton onClick={() => onResolve(index, "remote")}>
                Use theirs
              </ResolutionButton>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
