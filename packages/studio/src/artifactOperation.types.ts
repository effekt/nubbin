import type { Artifact } from "@nubbin/core";

/** Host operation used by the reusable artifact-download boundary. */
export type ArtifactOperation = (
  route: string,
) => Artifact | undefined | Promise<Artifact | undefined>;
