"use client";

import type { PuckApi } from "@measured/puck";
import { type RefObject, useRef, useState } from "react";
import type { PaletteBlock, PaletteGroup } from "../nubbin/paletteGroup.types";
import { toBlockCount } from "../nubbin/toBlockCount";
import { toMatchingGroups } from "../nubbin/toMatchingGroups";
import { withToggled } from "../nubbin/withToggled";
import "./blockPalette.css";
import { BlockPreviewPanel } from "./BlockPreviewPanel";
import { insertBlockAtSelection } from "./insertBlockAtSelection";
import { PaletteDetailBar } from "./PaletteDetailBar";
import { PaletteEmptyState } from "./PaletteEmptyState";
import { PaletteSearch } from "./PaletteSearch";
import { PaletteSection } from "./PaletteSection";
import { useCloseOnEscape } from "./useCloseOnEscape";
import { useHoverPreview } from "./useHoverPreview";

/** The Blocks card's content, replacing Puck's own list through the `drawer` override: the
 * card's title and the search inline in one compact head row, the categories with their
 * filtered counts, and the detail bar pinned at the foot saying what the pointed-at block
 * is for — or how to add one. Enter on a row inserts it at the selection through the Puck
 * API the bridge hands over. The component holds its own state, so the overrides object it
 * renders through stays referentially stable — nothing here reaches Puck as a new prop per
 * keystroke. */
export function BlockPalette({
  groups,
  apiRef,
}: {
  groups: readonly PaletteGroup[];
  apiRef: RefObject<(() => PuckApi) | undefined>;
}) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<PaletteBlock | undefined>(undefined);
  // Titles the reader has collapsed. A live search forces every matching section open —
  // a collapsed section hiding hits would make search look broken — without touching this
  // set, so clearing the search restores exactly the sections the reader had closed.
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const card = useRef<HTMLDivElement>(null);
  // The panel trails the detail bar: same pointed-at block, its own delays, Escape to close.
  const { preview, dismiss } = useHoverPreview(detail);
  useCloseOnEscape(preview !== undefined, dismiss);
  const matching = toMatchingGroups(query, groups);
  // A keystroke can unmount the row under the cursor, and an unmounted row fires no
  // mouseleave — so the query change itself resets the detail rather than trusting one.
  const onQuery = (next: string) => {
    setQuery(next);
    setDetail(undefined);
  };
  const onInsert = (block: PaletteBlock) => {
    const api = apiRef.current?.();
    if (api !== undefined) {
      insertBlockAtSelection(api, block.name);
    }
  };
  return (
    <div className="nb-palette" ref={card}>
      <div className="nb-palette-head">
        <h2>Blocks</h2>
        <PaletteSearch query={query} total={toBlockCount(groups)} onChange={onQuery} />
      </div>
      <div className="nb-palette-groups">
        {matching.length === 0 ? (
          <PaletteEmptyState query={query} onClear={() => onQuery("")} />
        ) : (
          matching.map((group) => (
            <PaletteSection
              key={group.title}
              group={group}
              onDetail={setDetail}
              onInsert={onInsert}
              open={query !== "" || !collapsed.has(group.title)}
              onToggle={() => setCollapsed((prev) => withToggled(prev, group.title))}
            />
          ))
        )}
      </div>
      <PaletteDetailBar block={detail} />
      <BlockPreviewPanel block={preview} anchor={card} />
    </div>
  );
}
