/** The file `init` writes, and the one the search prefers where both are present. */
export const TYPESCRIPT_CONFIG_FILENAME = "nubbin.config.ts";

/**
 * TypeScript first: where both are present the `.js` is compiled output beside its own source,
 * and loading it would run a copy of the config that is one build behind.
 */
export const CONFIG_FILENAMES = [TYPESCRIPT_CONFIG_FILENAME, "nubbin.config.js"] as const;
