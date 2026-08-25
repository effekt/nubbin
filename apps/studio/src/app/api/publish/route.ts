import { createPublishRequestHandler } from "@nubbin/studio";
import { consumerOrigin } from "../../../nubbin/consumerOrigin";
import { prefixedRoute } from "../../../nubbin/prefixedRoute";
import { publishDraft } from "../../../nubbin/publishDraft";
import { studioStore } from "../../../nubbin/studioStore";

/**
 * Unauthenticated on purpose: the studio deploys behind the consumer's own gate — a VPN, a
 * reverse proxy, existing auth — which is a supported deployment. Form-encoded so the preview
 * page can publish with no client JavaScript; that form still gets its 303 back to the
 * preview, while a caller asking for JSON gets `{ok: true, hash, url, timings}` — the live page's URL
 * built here from the one consumer-origin seam, so no client needs a second variable to link
 * it. A draft the compiler refuses answers the issues as `{ok: false, issues}` rather than
 * crashing — publish is the gate, and the refusal is the report the editor translates into
 * author words.
 */
export const POST = createPublishRequestHandler({
  publish: (route) => publishDraft(studioStore(), route),
  consumerOrigin,
  previewPath: (route) => prefixedRoute("/preview", route),
});
