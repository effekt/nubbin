import type { CommandArgs } from "./command.types";
import { requiredArgument } from "./requiredArgument";

/** The route is positional 0 for every command that takes one — stated once, here. */
export const routeArgument = (args: CommandArgs): string => requiredArgument(args, 0, "route");
