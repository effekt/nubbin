import { createJiti } from "jiti";
import { assertNubbinConfig } from "./assertNubbinConfig";
import type { NubbinConfig } from "./config.types";

/**
 * Imports the consumer's config through `jiti`, which is what makes a TypeScript config beside a
 * Next application loadable: that file imports the way application code does — extensionless,
 * often aliased — and bare Node ESM resolves neither.
 */
export async function loadConfig(path: string): Promise<NubbinConfig> {
  // JSX on, because a block definition carries its component beside its schema: reaching a
  // consumer's registry means parsing the `.tsx` those definitions import, even though nothing
  // here renders one.
  const jiti = createJiti(import.meta.url, { jsx: true });
  const exported: unknown = await jiti.import(path, { default: true });
  assertNubbinConfig(exported, path);
  return exported;
}
