import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { NubbinConfig } from "../config.types";
import { projectAt } from "./projectAt";

/**
 * The fixture project in a directory of its own. The store is real rather than a double because
 * publishing is IO — a command that writes an artifact and then moves a pointer is only proven
 * by a store that keeps both, in that order.
 */
export async function fixtureProject(): Promise<{ config: NubbinConfig; root: string }> {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-project-"));
  return { root, config: projectAt(root) };
}
