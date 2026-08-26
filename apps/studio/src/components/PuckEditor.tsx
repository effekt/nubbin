"use client";

import "@measured/puck/puck.css";
import "@nubbin/studio-ui/styles.css";
import { DefaultStudioEditor, type StudioEditorProps } from "@nubbin/studio-ui";
import { useMemo } from "react";
import { goToEditor } from "../nubbin/goToEditor";
import { prefixedRoute } from "../nubbin/prefixedRoute";
import { titleFromRoute } from "../nubbin/titleFromRoute";

/** The Nubbin editor engine composed with this host's current visual chrome. */
export function PuckEditor(props: StudioEditorProps) {
  const navigation = useMemo(
    () => ({
      blockPreviewHref: (name: string) => prefixedRoute("/block-preview", `/${name}`),
      editHref: (route: string) => prefixedRoute("/edit", route),
      previewHref: (route: string) => prefixedRoute("/preview", route),
      onRouteCreated: goToEditor,
      titleForRoute: titleFromRoute,
    }),
    [],
  );
  return <DefaultStudioEditor {...props} navigation={navigation} />;
}
