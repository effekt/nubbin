"use client";

import "@measured/puck/puck.css";
import "@nubbin/studio-ui/styles.css";
import "./puckTheme.css";
import "./canvasOverlay.css";
import {
  OutcomeNotice,
  StudioEditor,
  type StudioEditorPresentation,
  type StudioEditorProps,
  StudioStatusBar,
} from "@nubbin/studio-ui";
import { useMemo } from "react";
import { toPuckConfig } from "../nubbin/toPuckConfig";
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
        viewports,
        operations,
        onOutcome,
        palette,
        docsByBlock,
        slotsByBlock,
      }) =>
        toBridgedOverrides(
          apiRef,
          { route, routes },
          viewports,
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
