import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Append, never read-modify-write: a JSON array would have to be read, extended and written
 * back, and that is the shared rewrite this store exists not to have — two appenders racing
 * for one route each add their own line, and neither can lose the other's. The value goes on
 * one line so a reader can split the file without parsing across boundaries.
 */
export async function appendJsonLine(filePath: string, value: object): Promise<void> {
  const line = `${JSON.stringify(value)}\n`;
  await mkdir(dirname(filePath), { recursive: true });
  await appendFile(filePath, line);
}
