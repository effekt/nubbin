import type { PublishTimings } from "./publishTimings.types";

export interface PublishedDraft {
  hash: string;
  timings: PublishTimings;
}

/** Host-owned compilation, artifact persistence, and pointer movement for a draft. */
export type PublishOperation = (
  route: string,
) => PublishedDraft | undefined | Promise<PublishedDraft | undefined>;
