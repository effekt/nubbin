import type { CommandArgs, CommandEntry } from "./command.types";
import { UsageError } from "./UsageError";

/** Each flag beside the entry marker that says a command reads it, and the refusal otherwise. */
const FLAG_GATES = [
  { flag: "origin", when: "moves", unread: "moves no pointer, so --origin would do nothing" },
  {
    flag: "to",
    when: "resolves",
    unread: "resolves no document version, so --to would do nothing",
  },
  { flag: "parent", when: "places", unread: "places no node, so --parent would do nothing" },
  { flag: "slot", when: "places", unread: "places no node, so --slot would do nothing" },
  { flag: "index", when: "places", unread: "places no node, so --index would do nothing" },
] as const;

/**
 * A flag on a command that ignores it is refused, never dropped: `status --origin http://prod`
 * would answer from the local store while looking like it asked the server, and a `--parent` on
 * `remove` says the person believes something about `remove` that is not true.
 */
export function refuseUnreadFlags(command: string, entry: CommandEntry, args: CommandArgs): void {
  for (const { flag, when, unread } of FLAG_GATES) {
    if (args[flag] !== undefined && entry[when] !== true) {
      throw new UsageError(`${command} ${unread}`);
    }
  }
}
