import type { HistoryReply } from "./historyReply.types";
import type { PublishOutcome } from "./publishOutcome.types";

/** The publishing services a host supplies to the reusable editor. The editor owns the
 * interaction and reporting; the host owns transport, authorization, and persistence. */
export interface StudioOperations {
  publish(route: string): Promise<PublishOutcome>;
  history(route: string): Promise<HistoryReply | undefined>;
  rollback(route: string, hash: string): Promise<PublishOutcome>;
}
