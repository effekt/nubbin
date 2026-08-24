"use client";

import type { PointerMove } from "@nubbin/core";
import { useState } from "react";
import { formatMovedAt } from "../nubbin/formatMovedAt";
import { rollbackLabel } from "../nubbin/rollbackLabel";
import { shortHash } from "../nubbin/shortHash";

interface HistoryRowProps {
  move: PointerMove;
  current: boolean;
  onRollback: (hash: string) => void;
}

/** One pointer move: the hash cut short, when it moved, and the way back. The live row says
 * "current" in words — never a tint alone — and its rollback control is disabled with the
 * reason as its label, since there is nothing to roll back to. Rolling back is a two-step
 * press on the same button, so a slip confirms rather than ships. */
export function HistoryRow({ move, current, onRollback }: HistoryRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const press = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setPending(true);
    onRollback(move.hash);
  };
  return (
    <li className="nubbin-history-row">
      <code>{shortHash(move.hash)}</code>
      <time dateTime={move.movedAt}>{formatMovedAt(move.movedAt)}</time>
      {current ? <span className="nubbin-history-current">current</span> : null}
      {current ? (
        <button type="button" disabled>
          Live now
        </button>
      ) : (
        <button type="button" onClick={press} disabled={pending} aria-pressed={confirming}>
          {rollbackLabel(confirming, pending)}
        </button>
      )}
    </li>
  );
}
