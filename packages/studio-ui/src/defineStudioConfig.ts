import type { StudioConfig } from "./studioConfig.types";

/** Preserves a consumer's concrete Studio binding while checking its public contract. */
export function defineStudioConfig<Config extends StudioConfig>(config: Config): Config {
  return config;
}
