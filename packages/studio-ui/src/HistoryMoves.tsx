"use client";

import type { HistoryReply } from "@nubbin/studio";
import { HistoryRow } from "./HistoryRow";

interface HistoryMovesProps {
  reply: HistoryReply;
  onRollback: (hash: string) => void;
}

/** A loaded history reply, rendered honestly: a store keeping no history says so — that gap
 * is the adapter's to have — an empty log says nothing was published, and a capped list says
 * how much of the log it shows. Rows arrive newest first from the endpoint. */
export function HistoryMoves({ reply, onRollback }: HistoryMovesProps) {
  const { current, moves, total } = reply;
  if (moves === null) {
    return <p>This store keeps no history — its adapter implements no history(route).</p>;
  }
  if (moves.length === 0) {
    return <p>Nothing has been published here yet.</p>;
  }
  return (
    <>
      <ul>
        {moves.map((move) => (
          <HistoryRow
            key={`${move.movedAt}:${move.hash}`}
            move={move}
            current={move.hash === current}
            onRollback={onRollback}
          />
        ))}
      </ul>
      {total > moves.length ? (
        <p className="nubbin-history-capped">
          Showing the last {moves.length} of {total} moves.
        </p>
      ) : null}
    </>
  );
}
