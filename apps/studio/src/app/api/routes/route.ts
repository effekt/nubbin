import { NubbinError } from "@nubbin/core";
import { parseRouteCreateRequest } from "@nubbin/studio";
import { createDraft } from "../../../nubbin/createDraft";

const CREATED = 201;
const BAD_REQUEST = 400;
const CONFLICT = 409;

/**
 * Creates a page: a blank draft written at a new route, which `/edit` serves like any
 * other. The route's judge is core's — a malformed one answers 400 carrying the compiler's
 * own message, so the form shows the same words publish would have used — and a route the
 * studio already edits, fixture or draft, is a conflict rather than a silent overwrite.
 * Unauthenticated like its siblings: the studio deploys behind the consumer's own gate.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => undefined);
  const create = parseRouteCreateRequest(body);
  if (create === undefined) {
    return new Response("malformed create", { status: BAD_REQUEST });
  }
  try {
    const outcome = createDraft(create.route);
    if ("exists" in outcome) {
      return new Response(`a page already lives at ${create.route}`, { status: CONFLICT });
    }
    return Response.json({ ok: true, route: create.route }, { status: CREATED });
  } catch (error) {
    if (error instanceof NubbinError) {
      return new Response(error.message, { status: BAD_REQUEST });
    }
    throw error;
  }
}
