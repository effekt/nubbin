import { randomUUID } from "node:crypto";
import { addNode } from "@nubbin/core";
import type { Command } from "./command.types";
import { editingCommand } from "./editingCommand";
import { placementOf } from "./placementOf";
import { requiredArgument } from "./requiredArgument";

/**
 * Mint a node into a parent's slot. The id is minted here, not in `core`: a generator inside
 * `addNode` would make one composition produce a different document each time, which content
 * addressing cannot tolerate — so the caller mints, and this caller prints what it minted,
 * after the arrow, because the id is what every later command addresses the node by.
 *
 * Props start as the block's catalog `defaults`: a block with required fields and empty props
 * cannot compile, and refusing every `add` until a `set` lands would leave the two commands no
 * legal order to run in.
 */
export const addCommand: Command = editingCommand((context) => {
  const id = randomUUID();
  const block = requiredArgument(context.args, 1, "block");
  const place = placementOf(context);
  const props = structuredClone(context.catalog[block]?.defaults ?? {});
  return {
    edited: addNode(context.version, place.parent, place.slot, { id, block, props }, place.index),
    changed: `added ${block} to ${context.route} -> ${id}`,
  };
});
