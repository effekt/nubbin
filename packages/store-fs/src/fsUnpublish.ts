import { rm } from "node:fs/promises";
import { pointerPath } from "./pointerPath";

/**
 * `force` because unpublishing an already-unpublished route is a no-op, not an error. The
 * route's history log is left where it is — a route taken down and put back keeps its trail.
 */
export async function fsUnpublish(root: string, route: string): Promise<void> {
  await rm(pointerPath(root, route), { force: true });
}
