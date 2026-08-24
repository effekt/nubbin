import type { CommandArgs } from "./command.types";
import { requiredFlag } from "./requiredFlag";

/** Where a node lands: a parent, one of its slots, and optionally a position in it. */
export interface Placement {
  parent: string;
  slot: string;
  index?: number;
}

/**
 * `add` and `move` both aim at a slot, and both aim with the same three flags — `--parent` and
 * `--slot` because a slot only exists on a node, `--index` because its absence already means
 * "the end" and a positional that usually is not there reads as a mistake.
 */
export function placementOf({ args }: { args: CommandArgs }): Placement {
  return {
    parent: requiredFlag(args.parent, "parent"),
    slot: requiredFlag(args.slot, "slot"),
    ...(args.index === undefined ? {} : { index: args.index }),
  };
}
