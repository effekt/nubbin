import type { HoleResolver } from "@nubbin/react";
import { demoHoleValue } from "./demoHoleValue";

let resolved = 0;

/** Resolves the demo's live fields in a Studio process without requiring the demo server. */
export const resolveStudioHole: HoleResolver = async ({ block, path }) => {
  resolved += 1;
  return demoHoleValue(block, path, { now: Date.now(), served: resolved });
};
