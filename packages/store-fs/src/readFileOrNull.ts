import { readFile } from "node:fs/promises";

/** ENOENT is a value here — a file that was never written reads as null, not a throw. */
export async function readFileOrNull(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
