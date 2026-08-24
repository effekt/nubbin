"use client";

import { useState } from "react";
import type { PaletteBlock, PaletteGroup } from "../nubbin/paletteGroup.types";
import { toMatchingGroups } from "../nubbin/toMatchingGroups";
import "./blockPalette.css";
import { PaletteDetailBar } from "./PaletteDetailBar";
import { PaletteEmptyState } from "./PaletteEmptyState";
import { PaletteSearch } from "./PaletteSearch";
import { PaletteSection } from "./PaletteSection";

/** The Blocks card's content, replacing Puck's own list through the `drawer` override: a
 * search over name and description, the categories with their filtered counts, and the
 * detail bar pinned at the foot saying what the pointed-at block is for. The component
 * holds its own state, so the overrides object it renders through stays referentially
 * stable — nothing here reaches Puck as a new prop per keystroke. */
export function BlockPalette({ groups }: { groups: readonly PaletteGroup[] }) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<PaletteBlock | undefined>(undefined);
  const matching = toMatchingGroups(query, groups);
  // A keystroke can unmount the row under the cursor, and an unmounted row fires no
  // mouseleave — so the query change itself resets the detail rather than trusting one.
  const onQuery = (next: string) => {
    setQuery(next);
    setDetail(undefined);
  };
  return (
    <div className="nb-palette">
      <PaletteSearch query={query} onChange={onQuery} />
      <div className="nb-palette-groups">
        {matching.length === 0 ? (
          <PaletteEmptyState query={query} onClear={() => onQuery("")} />
        ) : (
          matching.map((group) => (
            <PaletteSection key={group.title} group={group} onDetail={setDetail} />
          ))
        )}
      </div>
      <PaletteDetailBar block={detail} />
    </div>
  );
}
