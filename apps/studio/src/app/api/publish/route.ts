import { NubbinError } from "@nubbin/core";
import { prefixedRoute } from "../../../nubbin/prefixedRoute";
import { publishDraft } from "../../../nubbin/publishDraft";
import { studioStore } from "../../../nubbin/studioStore";

const SEE_OTHER = 303;
const BAD_REQUEST = 400;
const UNPROCESSABLE = 422;

/**
 * Unauthenticated on purpose: the studio deploys behind the consumer's own gate — a VPN, a
 * reverse proxy, existing auth — which is a supported deployment. Form-encoded so the preview page can
 * publish with no client JavaScript. A draft the compiler refuses answers the issues as
 * `{ok: false, issues}` rather than crashing — publish is the gate, and the refusal is the
 * report the editor translates into author words.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const route = String(form.get("route") ?? "");
  try {
    const hash = await publishDraft(studioStore, route);
    if (hash === undefined) {
      return new Response(`no draft for ${route}`, { status: BAD_REQUEST });
    }
    const back = new URL(`${prefixedRoute("/preview", route)}?published=${hash}`, request.url);
    return Response.redirect(back, SEE_OTHER);
  } catch (error) {
    if (error instanceof NubbinError) {
      return Response.json({ ok: false, issues: error.issues }, { status: UNPROCESSABLE });
    }
    throw error;
  }
}
