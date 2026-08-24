"use client";

import "./publishControl.css";
import { useCallback, useRef, useState } from "react";
import { postPublish } from "../nubbin/postPublish";
import { publishLabel } from "../nubbin/publishLabel";
import type { PublishOutcome, PublishSuccess } from "../nubbin/publishOutcome.types";
import { PublishButton } from "./PublishButton";
import { PublishPanel, type PublishView } from "./PublishPanel";
import { patchEditorStatus } from "./patchEditorStatus";
import { useCloseOnEscape } from "./useCloseOnEscape";
import { useCloseOnOutsideClick } from "./useCloseOnOutsideClick";
import { useEditorStatus } from "./useEditorStatus";

interface PublishControlProps {
  route: string;
  onOutcome: (outcome: PublishOutcome) => void;
}

/** The masthead's publish hardware as a split control. The primary button publishes and
 * opens the panel on its report: the three steps pending, then checked with the server's
 * timings and the live strip — a refusal instead closes the panel and hands its issues up
 * to the editor's own panel. The chevron beside it — its own real button — discloses the
 * route's history with a guarded way back. Escape closes and hands focus to the chevron; a
 * click elsewhere closes without stealing focus from where it landed; a rollback's outcome
 * closes the panel and reports through the same flow. */
export function PublishControl({ route, onOutcome }: PublishControlProps) {
  const { published } = useEditorStatus();
  const [view, setView] = useState<PublishView | "closed">("closed");
  const [landed, setLanded] = useState<PublishSuccess | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setView("closed");
    toggleRef.current?.focus();
  }, []);
  useCloseOnEscape(view !== "closed", close);
  useCloseOnOutsideClick(view !== "closed", rootRef, () => setView("closed"));
  const publish = () => {
    setView("publishing");
    void postPublish(route).then((outcome) => {
      if (outcome.ok) {
        setLanded(outcome);
        setView("published");
        patchEditorStatus({ published: true });
        return;
      }
      onOutcome(outcome);
      close();
    });
  };
  const settle = (outcome: PublishOutcome) => {
    onOutcome(outcome);
    close();
  };
  return (
    <div ref={rootRef} className="nubbin-publish">
      <PublishButton label={publishLabel(published)} onPublish={publish} />
      <button
        type="button"
        ref={toggleRef}
        aria-expanded={view !== "closed"}
        aria-label="Publish history and rollback"
        className="nubbin-publish-toggle"
        onClick={() => (view === "closed" ? setView("history") : close())}
      >
        <span aria-hidden="true">▾</span>
      </button>
      {view === "closed" ? null : (
        <PublishPanel
          view={view}
          route={route}
          landed={landed}
          onOutcome={settle}
          onShowHistory={() => setView("history")}
        />
      )}
    </div>
  );
}
