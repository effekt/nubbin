"use client";

import "@measured/puck/puck.css";
import "./puckTheme.css";
import "./canvasOverlay.css";
import {
  StudioEditor,
  type StudioEditorPresentation,
  type StudioEditorProps,
} from "@nubbin/studio-ui";
import { useMemo } from "react";
import { toPuckConfig } from "../nubbin/toPuckConfig";
import { OutcomeNotice } from "./OutcomeNotice";
import { StudioStatusBar } from "./StudioStatusBar";
import { toBridgedOverrides } from "./toBridgedOverrides";

/** The Nubbin editor engine composed with this host's current visual chrome. */
export function PuckEditor(props: StudioEditorProps) {
  const puckConfig = useMemo(
    () => toPuckConfig(props.config.catalog, props.config.registry),
    [props.config.catalog, props.config.registry],
  );
  const presentation = useMemo<StudioEditorPresentation>(
    () => ({
      overrides: ({
        apiRef,
        route,
        routes,
        operations,
        onOutcome,
        palette,
        docsByBlock,
        slotsByBlock,
      }) =>
        toBridgedOverrides(
          apiRef,
          { route, routes },
          operations,
          onOutcome,
          palette,
          docsByBlock,
          slotsByBlock,
        ),
      outcome: (outcome, dismiss) => <OutcomeNotice outcome={outcome} onDismiss={dismiss} />,
      status: () => <StudioStatusBar />,
    }),
    [],
  );
  return <StudioEditor {...props} puckConfig={puckConfig} presentation={presentation} />;
}
