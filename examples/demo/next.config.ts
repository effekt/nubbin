import type { NextConfig } from "next";

/**
 * `outputFileTracingExcludes` keeps the artifact store out of the deployment.
 *
 * Next traces what a route reads and copies it into the standalone output. `createFsArtifactStore`
 * reads a directory it can resolve statically, so the tracer walked it and listed all sixteen
 * files — every artifact and every route pointer — as dependencies of the catch-all. A deploy
 * would then ship a snapshot of whatever was published when the build ran, which is exactly the
 * coupling between publishing and deploying that Nubbin exists to remove.
 *
 * `live/` is excluded for the same reason. It is a committed store standing in for what is
 * already published, read by the compatibility guardrail in CI — never by a request.
 *
 * A store is state. It is mounted, not built.
 */
const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "**/*": ["**/.nubbin/**", "**/live/**"],
  },
};

export default nextConfig;
