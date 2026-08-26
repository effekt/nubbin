"use client";

import "@measured/puck/puck.css";
import "@nubbin/studio-ui/styles.css";
import "./puckTheme.css";
import {
  OutcomeNotice,
  StudioEditor,
  type StudioEditorPresentation,
  type StudioEditorProps,
  StudioStatusBar,
  toDefaultStudioOverrides,
  toPuckConfig,
} from "@nubbin/studio-ui";
import { useMemo } from "react";
import { goToEditor } from "../nubbin/goToEditor";
import { prefixedRoute } from "../nubbin/prefixedRoute";
import { titleFromRoute } from "../nubbin/titleFromRoute";

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
        toDefaultStudioOverrides(
          apiRef,
          { route, routes },
          viewports,
          operations,
          onOutcome,
          palette,
          docsByBlock,
          slotsByBlock,
          {
            blockPreviewHref: (name) => prefixedRoute("/block-preview", `/${name}`),
            editHref: (route) => prefixedRoute("/edit", route),
            previewHref: (route) => prefixedRoute("/preview", route),
            onRouteCreated: goToEditor,
            titleForRoute: titleFromRoute,
          },
        ),
      outcome: (outcome, dismiss) => <OutcomeNotice outcome={outcome} onDismiss={dismiss} />,
      status: () => <StudioStatusBar />,
    }),
    [],
  );
  return <StudioEditor {...props} puckConfig={puckConfig} presentation={presentation} />;
}
