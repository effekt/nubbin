import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { messageOf } from "./messageOf";
import { pathExists } from "./pathExists";
import { UsageError } from "./UsageError";

/**
 * The text of a plan file, named relative to the working directory. Absence is its own refusal,
 * worded as the argument was typed, because "no such file" is fixed by looking at the path and
 * every other failure to read is fixed somewhere else.
 */
export async function readPlanText(cwd: string, argument: string): Promise<string> {
  const path = resolve(cwd, argument);
  if (!(await pathExists(path))) throw new UsageError(`no plan file at ${argument}`);
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    throw new UsageError(`could not read ${argument}: ${messageOf(error)}`);
  }
}
