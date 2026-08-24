"use client";

import { useEffect, useState } from "react";
import { getHistory } from "../nubbin/getHistory";
import type { HistoryReply } from "../nubbin/historyReply.types";
import { postRollback } from "../nubbin/postRollback";
import type { PublishOutcome } from "../nubbin/publishOutcome.types";
import { HistoryMoves } from "./HistoryMoves";

interface HistoryPanelProps {
  route: string;
  onOutcome: (outcome: PublishOutcome) => void;
}

/** The dropdown's body: the route's history fetched when the panel opens, then the rows —
 * and a rollback posts to the endpoint and hands whatever came back, landed or refused,
 * to the same outcome flow a publish reports through. A load that failed says so in words
 * rather than showing an empty log that reads as "never published". */
export function HistoryPanel({ route, onOutcome }: HistoryPanelProps) {
  const [reply, setReply] = useState<HistoryReply | "loading" | "failed">("loading");
  useEffect(() => {
    let stale = false;
    void getHistory(route).then((loaded) => {
      if (!stale) {
        setReply(loaded ?? "failed");
      }
    });
    return () => {
      stale = true;
    };
  }, [route]);
  const rollBack = (hash: string) => {
    void postRollback(route, hash).then(onOutcome);
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
