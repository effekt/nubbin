import type { StudioConfig } from "./studioConfig.types";

/** Defines one Studio deployment while preserving the config's literal block and viewport types. */
export function defineStudioConfig<Config extends StudioConfig>(config: Config): Config {
  return config;
}
