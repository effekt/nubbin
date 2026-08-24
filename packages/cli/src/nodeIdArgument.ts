import type { CommandArgs } from "./command.types";
import { requiredArgument } from "./requiredArgument";

/** The node id is positional 1 for every verb that addresses one — stated once, here. */
export const nodeIdArgument = (args: CommandArgs): string => requiredArgument(args, 1, "node id");
