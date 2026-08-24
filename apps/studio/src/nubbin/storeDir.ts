import { join } from "node:path";

/**
 * Where the studio's artifact store lives: the demo's own `.nubbin`, reached from the
 * studio's cwd (`apps/studio`), because this studio edits the demo site and publishing must
 * move the pointers the demo serves from. A consumer points this at wherever their app's
 * store lives.
 *
 * The environment override exists for the same reason `NUBBIN_STUDIO_DRAFTS` does: tests
 * run in parallel files that must not share one directory — and must never write the demo's
 * real store; the studio itself never sets it.
 */
export function storeDir(): string {
  return (
    process.env.NUBBIN_STUDIO_STORE ??
    join(process.cwd(), "..", "..", "examples", "demo", ".nubbin")
  );
}
