import { UsageError } from "./UsageError";

/**
 * `--index` names a position in a slot, so anything but a whole number is refused before a
 * command runs. `core` reads a position past the end as "append", which is also what an absent
 * index means — the flag only exists to say somewhere more specific.
 */
export function parseIndexFlag(raw: string): number {
  if (!/^\d+$/.test(raw)) {
    throw new UsageError(`--index names a position in a slot, which "${raw}" is not`);
  }
  return Number(raw);
}
