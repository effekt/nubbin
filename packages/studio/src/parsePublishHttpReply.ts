import { parsePublishRefusalHttpReply } from "./parsePublishRefusalHttpReply";
import { parsePublishSuccessHttpReply } from "./parsePublishSuccessHttpReply";
import type { PublishOutcome } from "./publishOutcome.types";

/** Judges the shared publish/rollback HTTP reply contract. */
export function parsePublishHttpReply(
  route: string,
  response: Response,
  body: string,
): PublishOutcome {
  return response.ok
    ? parsePublishSuccessHttpReply(route, body)
    : parsePublishRefusalHttpReply(response.status, body);
}
