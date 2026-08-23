import { createJiti } from "jiti";
import { assertNubbinConfig } from "./assertNubbinConfig";
import type { NubbinConfig } from "./config.types";

/**
 * Imports the consumer's config through `jiti`, which is what makes a TypeScript config beside a
 * Next application loadable: that file imports the way application code does — extensionless,
 * often aliased — and bare Node ESM resolves neither.
 */
export async function loadConfig(path: string): Promise<NubbinConfig> {
  const jiti = createJiti(import.meta.url);
  const exported: unknown = await jiti.import(path, { default: true });
  assertNubbinConfig(exported, path);
  return exported;
}
