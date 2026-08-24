import type { DocumentVersion } from "@nubbin/core";
import type { NubbinConfig } from "../config.types";
import { fixtureProject } from "./fixtureProject";

/**
 * The fixture project with a `save` that captures what it was given, so a test asserts on the
 * document that was persisted rather than only on the line that was printed.
 */
export async function editableProject(): Promise<{
  config: NubbinConfig;
  saved: Map<string, DocumentVersion>;
}> {
  const { config } = await fixtureProject();
  const saved = new Map<string, DocumentVersion>();
  return {
    saved,
    config: {
      ...config,
      save: (route, version) => {
        saved.set(route, version);
      },
    },
  };
}
