import { createParsedRequestHandler } from "./createParsedRequestHandler";
import { issueRefusalResponse } from "./issueRefusalResponse";
import { parseRollbackRequest } from "./parseRollbackRequest";
import type { RollbackOperation } from "./rollbackOperation.types";

const BAD_REQUEST = 400;
const UNPROCESSABLE = 422;

/** Creates a rollback endpoint while leaving storage, compatibility policy, and access control to the host. */
export function createRollbackRequestHandler(rollback: RollbackOperation) {
  return createParsedRequestHandler(parseRollbackRequest, "malformed rollback", async (input) => {
    const outcome = await rollback(input.route, input.hash);
    switch (outcome.status) {
      case "rolled-back":
        return Response.json({ ok: true, hash: outcome.hash, url: outcome.url });
      case "missing":
        return new Response(`no artifact ${outcome.hash}`, { status: BAD_REQUEST });
      case "route-mismatch":
        return new Response(
          `${outcome.hash} was compiled for ${outcome.artifactRoute}, not ${outcome.requestedRoute}`,
          { status: BAD_REQUEST },
        );
      case "refused":
        return issueRefusalResponse(outcome.issues, UNPROCESSABLE);
    }
  });
}
