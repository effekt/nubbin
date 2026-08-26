import { createParsedRequestHandler } from "./createParsedRequestHandler";
import { parseDraftSaveRequest } from "./parseDraftSaveRequest";
import type { SaveDraftOperation } from "./saveDraftOperation.types";

const BAD_REQUEST = 400;
const OK = 200;
const CONFLICT = 409;

/** Creates a Web-standard draft handler while leaving persistence and access control to the host. */
export function createDraftSaveRequestHandler(saveDraft: SaveDraftOperation) {
  return createParsedRequestHandler(parseDraftSaveRequest, "malformed save", async (save) => {
    const outcome = await saveDraft(save);
    if (outcome.status === "missing") {
      return new Response(`no draft for ${save.route}`, { status: BAD_REQUEST });
    }
    return Response.json(outcome, { status: outcome.status === "conflict" ? CONFLICT : OK });
  });
}
