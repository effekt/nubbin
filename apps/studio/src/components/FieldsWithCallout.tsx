"use client";

import { usePuck } from "@measured/puck";
import type { ReactNode } from "react";
import { InspectorCallout } from "./InspectorCallout";
import { useEditorStatus } from "./useEditorStatus";

interface FieldsWithCalloutProps {
  children: ReactNode;
}

/** The `fields` override's body: Puck's own field list untouched, with the callout above it
 * when the selected node has issues — the least invasive seam Puck offers, since the
 * override wraps the panel without re-implementing any field. Selection comes from Puck's
 * provider, issues from the status store, so the overrides object never changes identity. */
export function FieldsWithCallout({ children }: FieldsWithCalloutProps) {
  const { selectedItem } = usePuck();
  const { issues } = useEditorStatus();
  const nodeId = selectedItem?.props.id;
  const count = nodeId === undefined ? 0 : issues.filter((issue) => issue.nodeId === nodeId).length;
  return (
    <>
      {count > 0 && selectedItem != null ? (
        <InspectorCallout blockName={selectedItem.type} count={count} />
      ) : null}
      {children}
    </>
  );
}
