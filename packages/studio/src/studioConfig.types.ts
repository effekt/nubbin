import type { Catalog, DocumentVersion, Registry } from "@nubbin/core";
import type { BlockRegistry, HoleResolver } from "@nubbin/react";

/** One canvas width declared by the application whose components Studio renders. */
export interface StudioViewport {
  width: number;
  height: number | "auto";
  label: string;
  icon?: string;
}

/** Everything executable or consumer-specific that one Studio deployment is bound to. */
export interface StudioConfig {
  catalog: Catalog;
  registry: Registry;
  blockRegistry: BlockRegistry;
  seedDocuments: Readonly<Record<string, DocumentVersion>>;
  resolveHole: HoleResolver;
  viewports: StudioViewport[];
  artifactStoreDir: string;
  consumerOrigin: string;
}
