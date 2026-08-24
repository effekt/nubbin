import { setNodeProp } from "@nubbin/core";
import type { Command } from "./command.types";
import { editingCommand } from "./editingCommand";
import { nodeIdArgument } from "./nodeIdArgument";
import { parseValueLiteral } from "./parseValueLiteral";
import { refuseHintedPath } from "./refuseHintedPath";
import { requiredArgument } from "./requiredArgument";

/** After the node: the path on it, then the value for it — in the order spoken. */
const PATH_POSITIONAL = 2;
const VALUE_POSITIONAL = 3;

/**
 * Set one prop on one node. The value arrives as JSON when it parses as any — `42`, `true`,
 * `{"a":1}` — and as the string given otherwise, so a headline needs no quoting ritual. A path
 * carrying a `data` hint is refused by name before the operation runs: the write would succeed,
 * compile into a hole, and never be served.
 */
export const setCommand: Command = editingCommand((context) => {
  const path = requiredArgument(context.args, PATH_POSITIONAL, "path");
  const id = nodeIdArgument(context.args);
  const value = parseValueLiteral(requiredArgument(context.args, VALUE_POSITIONAL, "value"));
  refuseHintedPath(context.catalog, context.version, id, path);
  return {
    edited: setNodeProp(context.version, id, path, value),
    changed: `set ${path} on ${id} in ${context.route}`,
  };
});
