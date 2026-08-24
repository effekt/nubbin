"use client";

import "./inspectorSkin.css";
import { usePuck } from "@measured/puck";
import type { ReactNode } from "react";
import { InspectorCallout } from "./InspectorCallout";
import { InspectorDocsLinks } from "./InspectorDocsLinks";
import { InspectorFoot } from "./InspectorFoot";
import { InspectorHead } from "./InspectorHead";
import { useEditorStatus } from "./useEditorStatus";

interface FieldsWithCalloutProps {
  children: ReactNode;
  /** Each block's docs links by name; a block absent here renders no links row. */
  docsByBlock?: Record<string, Record<string, string>>;
  /** Each block's icon name by block name, for the head's glyph. */
  icons?: Record<string, string>;
}

/** The `fields` override's body, arranged as the specimen's inspector: the head naming the
 * selected block, then a body that scrolls alone — docs links, the callout while the
 * selected node has issues, and Puck's own field list untouched — then the quiet foot.
 * The least invasive seam Puck offers, since the override wraps the panel without
 * re-implementing any field. Selection comes from Puck's provider, issues from the status
 * store, so the overrides object never changes identity. */
export function FieldsWithCallout({ children, docsByBlock, icons }: FieldsWithCalloutProps) {
  const { selectedItem } = usePuck();
  const { issues } = useEditorStatus();
  const nodeId = selectedItem?.props.id;
  const count = nodeId === undefined ? 0 : issues.filter((issue) => issue.nodeId === nodeId).length;
  const docs = selectedItem == null ? undefined : docsByBlock?.[selectedItem.type];
  return (
    <>
      <InspectorHead icons={icons} />
      <div className="nb-insp-body">
        {docs !== undefined ? <InspectorDocsLinks docs={docs} /> : null}
        {count > 0 && selectedItem != null ? (
          <InspectorCallout blockName={selectedItem.type} count={count} />
        ) : null}
        {children}
      </div>
      <InspectorFoot />
    </>
  );
}
