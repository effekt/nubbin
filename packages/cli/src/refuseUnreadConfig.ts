import type { CommandEntry } from "./command.types";
import { UsageError } from "./UsageError";

/**
 * `--config` on a command that runs before a config exists is refused, not dropped. The flag is
 * split off before any command sees it — `parseCliArgs` turns it into `configPath` — so the
 * refusal that covers every other unread flag never meets it, and a person who typed it would
 * otherwise watch `init` write a file beside the one they named.
 */
export function refuseUnreadConfig(
  command: string,
  entry: CommandEntry,
  configPath: string | undefined,
): void {
  if (configPath !== undefined && entry.configless === true) {
    throw new UsageError(`${command} runs before a config exists, so it reads no --config`);
  }
}
