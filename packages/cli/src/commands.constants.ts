import { addCommand } from "./addCommand";
import { checkCommand } from "./checkCommand";
import type { CommandEntry } from "./command.types";
import { compileCommand } from "./compileCommand";
import { historyCommand } from "./historyCommand";
import { moveCommand } from "./moveCommand";
import { publishCommand } from "./publishCommand";
import { removeCommand } from "./removeCommand";
import { rollbackCommand } from "./rollbackCommand";
import { setCommand } from "./setCommand";
import { showCommand } from "./showCommand";
import { statusCommand } from "./statusCommand";
import { unpublishCommand } from "./unpublishCommand";

/**
 * Every command by the word that runs it, each beside the number of positionals it reads. The
 * count lives here rather than inside the command because it is what lets an argument nothing
 * reads be refused: `check /pricing` asks for something this release does not do, and answering
 * it by checking everything would be a lie told quietly.
 */
export const COMMANDS: Record<string, CommandEntry> = {
  add: { run: addCommand, takes: 2, places: true },
  check: { run: checkCommand, takes: 0 },
  compile: { run: compileCommand, takes: 1 },
  history: { run: historyCommand, takes: 1 },
  move: { run: moveCommand, takes: 2, places: true },
  publish: { run: publishCommand, takes: 1, moves: true },
  remove: { run: removeCommand, takes: 2 },
  rollback: { run: rollbackCommand, takes: 2, moves: true, resolves: true },
  set: { run: setCommand, takes: 4 },
  show: { run: showCommand, takes: 1 },
  status: { run: statusCommand, takes: 1 },
  unpublish: { run: unpublishCommand, takes: 1, moves: true },
};
