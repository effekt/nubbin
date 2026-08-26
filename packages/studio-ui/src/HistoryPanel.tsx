"use client";

import type { HistoryReply } from "@nubbin/studio";
import { useEffect, useState } from "react";
import { HistoryMoves } from "./HistoryMoves";
import type { PublishTarget } from "./publishTarget.types";

type HistoryPanelProps = PublishTarget;

/** The dropdown's body: the route's history fetched when the panel opens, then the rows —
 * and a rollback posts to the endpoint and hands whatever came back, landed or refused,
 * to the same outcome flow a publish reports through. A load that failed says so in words
 * rather than showing an empty log that reads as "never published". */
export function HistoryPanel({ route, operations, onOutcome }: HistoryPanelProps) {
  const [reply, setReply] = useState<HistoryReply | "loading" | "failed">("loading");
  useEffect(() => {
    let stale = false;
    void operations.history(route).then((loaded) => {
      if (!stale) {
        setReply(loaded ?? "failed");
      }
    });
    return () => {
      stale = true;
    };
  }, [route, operations]);
  const rollBack = (hash: string) => {
    void operations.rollback(route, hash).then(onOutcome);
  };
  return (
    <div className="nubbin-history">
      <h2>Publish history</h2>
      {reply === "loading" ? <p>Loading history…</p> : null}
      {reply === "failed" ? <p role="alert">History could not be loaded.</p> : null}
      {typeof reply === "object" ? <HistoryMoves reply={reply} onRollback={rollBack} /> : null}
    </div>
  );
}
