import { checkCommand } from "./checkCommand";
import type { CommandEntry } from "./command.types";
import { compileCommand } from "./compileCommand";
import { publishCommand } from "./publishCommand";
import { rollbackCommand } from "./rollbackCommand";
import { statusCommand } from "./statusCommand";
import { unpublishCommand } from "./unpublishCommand";

/**
 * Every command by the word that runs it, each beside the number of positionals it reads. The
 * count lives here rather than inside the command because it is what lets an argument nothing
 * reads be refused: `check /pricing` asks for something this release does not do, and answering
 * it by checking everything would be a lie told quietly.
 */
export const COMMANDS: Record<string, CommandEntry> = {
  check: { run: checkCommand, takes: 0 },
  compile: { run: compileCommand, takes: 1 },
  publish: { run: publishCommand, takes: 1, moves: true },
  rollback: { run: rollbackCommand, takes: 2, moves: true },
  status: { run: statusCommand, takes: 1 },
  unpublish: { run: unpublishCommand, takes: 1, moves: true },
};
