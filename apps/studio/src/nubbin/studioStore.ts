import type { ArtifactStore } from "@nubbin/core";
import { createFsArtifactStore } from "@nubbin/store-fs";
import { storeDir } from "./storeDir";

/**
 * The store every request-time caller publishes through and reads pointers from — built per
 * call so `storeDir`'s environment seam is honoured at request time, not at module load,
 * which is what lets a test point one request at a temporary directory.
 */
export function studioStore(): ArtifactStore {
  return createFsArtifactStore(storeDir());
}
