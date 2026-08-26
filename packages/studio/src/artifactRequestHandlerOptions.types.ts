import type { ArtifactOperation } from "./artifactOperation.types";
import type { RoutedRequestHandlerOptions } from "./routedRequestHandlerOptions.types";

/** Host seams required by the framework-neutral artifact handler. */
export type ArtifactRequestHandlerOptions<Context> = RoutedRequestHandlerOptions<
  Context,
  Awaited<ReturnType<ArtifactOperation>>
>;
