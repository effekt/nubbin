import { readdirSync } from "node:fs";
import { draftsDir } from "./draftsDir";

/** The routes the drafts directory holds, decoded from the one-file-per-route names
 * `draftFilePath` writes. ENOENT is a value — a studio nothing ever edited has no
 * directory, and that reads as no draft routes, not as a failure. A temp file from an
 * in-flight atomic write does not end in `.json`, so it never reads as a route. */
export function listDraftRoutes(): readonly string[] {
  let names: string[];
  try {
    names = readdirSync(draftsDir());
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
  return names
    .filter((name) => name.endsWith(".json"))
    .map((name) => decodeURIComponent(name.slice(0, -".json".length)));
}
