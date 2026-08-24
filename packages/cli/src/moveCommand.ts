import { moveNode } from "@nubbin/core";
import type { Command } from "./command.types";
import { editingCommand } from "./editingCommand";
import { nodeIdArgument } from "./nodeIdArgument";
import { placementOf } from "./placementOf";

/**
 * Move a node into a parent's slot. `--index` names a position in the slot as it stands after
 * the node is taken out, which is `moveNode`'s reading; a move the target slot's `allow` or
 * bounds refuse fails at the compile that follows, and saves nothing.
 */
export const moveCommand: Command = editingCommand((context) => {
  const place = placementOf(context);
  const id = nodeIdArgument(context.args);
  return {
    edited: moveNode(context.version, id, place.parent, place.slot, place.index),
    changed: `moved ${id} to ${place.parent}.${place.slot} in ${context.route}`,
  };
});
