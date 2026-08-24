import { removeNode } from "@nubbin/core";
import type { Command } from "./command.types";
import { editingCommand } from "./editingCommand";
import { nodeIdArgument } from "./nodeIdArgument";

/**
 * Remove a node and everything beneath it — the cascade is `removeNode`'s, argued there. What
 * this command adds is the refusal to persist the result when the document it leaves cannot
 * compile: emptying a slot below its `min`, or removing the last root, refuses and saves
 * nothing.
 */
export const removeCommand: Command = editingCommand((context) => {
  const id = nodeIdArgument(context.args);
  return {
    edited: removeNode(context.version, id),
    changed: `removed ${id} from ${context.route}`,
  };
});
