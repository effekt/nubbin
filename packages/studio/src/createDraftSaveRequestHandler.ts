import { createParsedRequestHandler } from "./createParsedRequestHandler";
import { nubbinRefusalResponse } from "./nubbinRefusalResponse";
import { parseDraftSaveRequest } from "./parseDraftSaveRequest";
import { respondToNubbinError } from "./respondToNubbinError";
import type { SaveDraftOperation } from "./saveDraftOperation.types";

const BAD_REQUEST = 400;

/** Creates a Web-standard draft handler while leaving persistence and access control to the host. */
export function createDraftSaveRequestHandler(saveDraft: SaveDraftOperation) {
  return createParsedRequestHandler(parseDraftSaveRequest, "malformed save", (save) =>
    respondToNubbinError(async () => {
      if ((await saveDraft(save.route, save.version)) === "missing") {
        return new Response(`no draft for ${save.route}`, { status: BAD_REQUEST });
      }
      return Response.json({ ok: true });
    }, nubbinRefusalResponse),
  );
}
