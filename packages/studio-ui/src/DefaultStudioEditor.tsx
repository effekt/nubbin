"use client";

import { useMemo } from "react";
import { OutcomeNotice } from "./OutcomeNotice";
import { StudioEditor } from "./StudioEditor";
import { StudioStatusBar } from "./StudioStatusBar";
import type { StudioEditorPresentation } from "./studioEditorPresentation.types";
import type { StudioEditorProps } from "./studioEditorProps.types";
import type { StudioNavigation } from "./toDefaultStudioOverrides";
import { toDefaultStudioOverrides } from "./toDefaultStudioOverrides";
import { toPuckConfig } from "./toPuckConfig";
import "./puckTheme.css";

export interface DefaultStudioEditorProps extends StudioEditorProps {
  navigation: StudioNavigation;
}

/** Nubbin's complete default editor, parameterized only by host navigation and operations. */
export function DefaultStudioEditor({ navigation, ...props }: DefaultStudioEditorProps) {
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
        toDefaultStudioOverrides(
          apiRef,
          { route, routes },
          viewports,
          operations,
          onOutcome,
          palette,
          docsByBlock,
          slotsByBlock,
          navigation,
        ),
      outcome: (outcome, dismiss) => <OutcomeNotice outcome={outcome} onDismiss={dismiss} />,
      status: () => <StudioStatusBar />,
    }),
    [navigation],
  );

  return <StudioEditor {...props} puckConfig={puckConfig} presentation={presentation} />;
}
