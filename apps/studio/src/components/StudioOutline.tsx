"use client";

import { usePuck } from "@measured/puck";
import type { SlotConstraint } from "@nubbin/core";
import { useState } from "react";
import { countOutlineBlocks } from "../nubbin/countOutlineBlocks";
import { toOutlineNodes } from "../nubbin/toOutlineNodes";
import { withToggled } from "../nubbin/withToggled";
import "./studioOutline.css";
import { OutlineNodeItem } from "./OutlineNodeItem";
import { selectPuckNode } from "./selectPuckNode";

/** The Outline card's content, replacing Puck's layer tree through the `outline` override:
 * the specimen's tree — every block behind the same glyph the palette draws, every
 * declared area as a small-caps row with its fullness chip, guide lines tying children to
 * their fold — under a head naming the card and counting the page's blocks, over the fixed
 * legend explaining the area rows. Clicking a block selects it in the editor exactly as
 * Puck's own tree did; folds are this card's own state. */
export function StudioOutline({
  icons,
  slotsByBlock,
}: {
  icons: Record<string, string>;
  slotsByBlock: Record<string, Record<string, SlotConstraint>>;
}) {
  const { appState, dispatch, getSelectorForId, selectedItem } = usePuck();
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const nodes = toOutlineNodes(appState.data.content, slotsByBlock);
  return (
    <div className="nb-outline">
      <div className="nb-outline-head">
        <h2>Page outline</h2>
        <span className="nb-outline-count">{countOutlineBlocks(nodes)} blocks</span>
      </div>
      <ul className="nb-outline-tree">
        {nodes.map((node) => (
          <OutlineNodeItem
            key={node.id}
            node={node}
            tree={{
              icons,
              collapsed,
              selectedId: selectedItem === null ? undefined : selectedItem.props.id,
              onToggle: (key) => setCollapsed((prev) => withToggled(prev, key)),
              onSelect: (id) => selectPuckNode({ getSelectorForId, dispatch }, id),
            }}
          />
        ))}
      </ul>
      <p className="nb-outline-legend">
        Small-caps rows are areas — a block&rsquo;s named spots for other blocks. Counts show how
        full each is.
      </p>
    </div>
  );
}
