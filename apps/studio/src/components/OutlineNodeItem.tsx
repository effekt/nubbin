"use client";

import type { OutlineNode } from "../nubbin/outlineNode.types";
import { OutlineAreaRow } from "./OutlineAreaRow";
import { OutlineBlockRow } from "./OutlineBlockRow";

export interface OutlineTreeState {
  icons: Record<string, string>;
  collapsed: ReadonlySet<string>;
  selectedId: string | undefined;
  onToggle: (key: string) => void;
  onSelect: (id: string) => void;
}

/** One block and everything beneath it: the block's row, then — while its disclosure is
 * open — each declared area's row with the blocks inside, recursively. Collapse keys are
 * `b:<id>` for a block's fold and `a:<id>:<name>` for an area's, so two areas under one
 * block fold apart. The recursion lives in this one file, keeping the module graph
 * acyclic. */
export function OutlineNodeItem({ node, tree }: { node: OutlineNode; tree: OutlineTreeState }) {
  const isOpen = !tree.collapsed.has(`b:${node.id}`);
  return (
    <li>
      <OutlineBlockRow
        node={node}
        icon={tree.icons[node.type]}
        isOpen={isOpen}
        isSelected={tree.selectedId === node.id}
        onSelect={() => tree.onSelect(node.id)}
        onToggle={() => tree.onToggle(`b:${node.id}`)}
      />
      {isOpen
        ? node.areas.map((area) => {
            const areaKey = `a:${node.id}:${area.name}`;
            const isAreaOpen = !tree.collapsed.has(areaKey);
            return (
              // Each nesting level — a block's areas, an area's blocks — is its own list,
              // stepped right and hung off its own guide line, so ancestry reads at a glance.
              <ul className="nb-outline-branch" key={area.name}>
                <li>
                  <OutlineAreaRow
                    area={area}
                    isOpen={isAreaOpen}
                    onToggle={() => tree.onToggle(areaKey)}
                  />
                  {isAreaOpen && area.children.length > 0 ? (
                    <ul className="nb-outline-branch">
                      {area.children.map((child) => (
                        <OutlineNodeItem key={child.id} node={child} tree={tree} />
                      ))}
                    </ul>
                  ) : null}
                </li>
              </ul>
            );
          })
        : null}
    </li>
  );
}
