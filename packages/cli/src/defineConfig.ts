import type { NubbinConfig } from "./config.types";

/**
 * Identity at runtime. It exists for the type: a config file gets the fields checked and
 * completed as it is written, rather than at the moment a publish fails.
 */
export const defineConfig = (config: NubbinConfig): NubbinConfig => config;
