import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Distinguishes concurrent calls within one process. The pid alone does not: two publishes to the
 * same route in one server both derived `<file>.<pid>.tmp`, so the first rename moved the shared
 * temp away and the second failed with ENOENT — a publish reporting an error after the pointer
 * had already moved.
 */
let writes = 0;

/**
 * Temp-write then rename: the rename is the single-key write. A concurrent reader sees the
 * old file or the new one, never half of either — the property route pointers depend on.
 *
 * The temp name carries the pid and a per-process counter, so no two writes in flight — in this
 * process or another — can name the same file. Racing writers then each rename their own whole
 * file over the target, and the last to land wins intact; none of them can tear or ENOENT.
 */
export async function writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  writes += 1;
  const temp = `${filePath}.${process.pid}.${writes}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2));
  await rename(temp, filePath);
}
