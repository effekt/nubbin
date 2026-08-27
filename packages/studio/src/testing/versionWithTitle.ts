import type { DocumentVersion } from "@nubbin/core";

/** Makes a distinct whole-document edit without changing its structural identity. */
export function versionWithTitle(version: DocumentVersion, title: string): DocumentVersion {
  return { ...version, meta: { ...version.meta, title } };
}
