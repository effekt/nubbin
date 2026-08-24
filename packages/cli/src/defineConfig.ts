import type { NubbinConfig } from "./config.types";

// Identity at runtime. It exists for the type: a config file gets the fields checked and
// completed as it is written, rather than at the moment a publish fails.
/**
 * Types a `nubbin.config.ts` as it is written. It returns its argument untouched — the call adds
 * no behaviour, only the annotation that makes an editor complete the four fields and a
 * typecheck reject a wrong one before any command runs.
 *
 * @param config - The config object, checked against {@link NubbinConfig} by this call.
 * @returns The same object, by reference. Nothing is copied, frozen or validated at runtime; the
 *   CLI checks what a config file exported when it loads it.
 * @example
 * ```ts
 * import { defineConfig } from "@nubbin/cli";
 *
 * export default defineConfig({ catalog, registry, store, document });
 * ```
 */
export const defineConfig = (config: NubbinConfig): NubbinConfig => config;
