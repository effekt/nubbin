import { parsePublishHttpReply } from "./parsePublishHttpReply";
import type { PublishOutcome } from "./publishOutcome.types";

/** Reads one publish-like HTTP response into the shared client outcome. */
export async function publishOutcomeFromResponse(
  route: string,
  response: Response,
): Promise<PublishOutcome> {
  return parsePublishHttpReply(route, response, await response.text());
}
