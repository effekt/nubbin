import type { NubbinConfig } from "./config.types";
import { UsageError } from "./UsageError";

const REQUIRED = ["catalog", "registry", "store", "document"] as const;

/**
 * Checks the shape of what a config file exported, so a missing field is reported against the
 * file that omitted it rather than as a property access somewhere inside a command.
 *
 * Presence, not validity: whether a registry is a registry is `compile`'s question, and it
 * answers it by name.
 */
export function assertNubbinConfig(value: unknown, path: string): asserts value is NubbinConfig {
  // A function is a default export, so "exports nothing" would be a lie — and a factory that
  // builds the config is a common idiom in other tools' config files, so it is worth naming.
  // Nothing here knows what such a factory takes, so it is refused rather than called.
  if (typeof value === "function") {
    throw new UsageError(
      `${path} default-exports a function, not a config — export what defineConfig({ … }) returns, not a factory for it`,
    );
  }
  if (typeof value !== "object" || value === null) {
    throw new UsageError(`${path} default-exports nothing — export defineConfig({ … }) from it`);
  }
  const missing = REQUIRED.filter((field) => Reflect.get(value, field) === undefined);
  if (missing.length > 0) {
    throw new UsageError(`${path} is missing ${missing.join(", ")}`);
  }
  if (typeof Reflect.get(value, "document") !== "function") {
    throw new UsageError(`${path} needs document to be a function of a route`);
  }
}
