import type { PublishOperation } from "./publishOperation.types";

export interface PublishRequestHandlerOptions {
  publish: PublishOperation;
  consumerOrigin: () => string;
  previewPath: (route: string) => string;
}
