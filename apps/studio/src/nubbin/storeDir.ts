import studioConfig from "@nubbin/studio-config";

/**
 * Where this Studio deployment's artifact store lives. The deployment config supplies the
 * ordinary value; the environment override keeps parallel tests isolated.
 *
 * The environment override exists for the same reason `NUBBIN_STUDIO_DRAFTS` does: tests
 * run in parallel files that must not share one directory; the studio itself never sets it.
 */
export function storeDir(): string {
  return process.env.NUBBIN_STUDIO_STORE ?? studioConfig.artifactStoreDir;
}
