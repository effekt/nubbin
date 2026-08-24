import { NubbinError } from "@nubbin/core";
import { parseDraftSave } from "../../../nubbin/parseDraftSave";
import { saveDraft } from "../../../nubbin/saveDraft";

const BAD_REQUEST = 400;

/**
 * One whole-document save. The editor is controlled, so the draft must hold exactly what
 * the author sees: the version is written before it is judged, and a compile refusal
 * answers 200 with `{ ok: false, issues }` — the save succeeded, the report is the payload,
 * and publish is the gate. Unauthenticated like the publish route: the studio deploys
 * behind the consumer's own gate.
 *
 * An unknown route is 400 like a malformed body — the same client fault, a save naming a
 * route the drafts do not hold.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => undefined);
  const save = parseDraftSave(body);
  if (save === undefined) {
    return new Response("malformed save", { status: BAD_REQUEST });
  }
  try {
    const outcome = saveDraft(save.route, save.version);
    if ("missing" in outcome) {
      return new Response(`no draft for ${save.route}`, { status: BAD_REQUEST });
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof NubbinError) {
      return Response.json({ ok: false, issues: error.issues });
    }
    throw error;
  }
}
