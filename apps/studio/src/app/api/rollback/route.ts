import { checkRollback } from "@nubbin/core";
import { parseRollbackRequest } from "@nubbin/studio";
import studioConfig from "@nubbin/studio-config";
import { consumerOrigin } from "../../../nubbin/consumerOrigin";
import { movePointerThroughOrigin } from "../../../nubbin/movePointerThroughOrigin";
import { studioStore } from "../../../nubbin/studioStore";
import { toDriftIssues } from "../../../nubbin/toDriftIssues";

const BAD_REQUEST = 400;
const UNPROCESSABLE = 422;

/**
 * Rollback is a pointer move: the target artifact already sits in the store, so nothing
 * compiles — the route is pointed back at it through the consumer's origin, the same path
 * publish takes, because the pointer must move inside the process that serves the page. The
 * guard is `checkRollback` against the running registry: drift refuses with issues in
 * publish's `{ok: false, issues}` shape, so the editor translates them the same way. An
 * artifact compiled for another route is refused however plausible the hash looks.
 * Unauthenticated like its siblings: the studio deploys behind the consumer's own gate.
 */
export async function POST(request: Request) {
  const rollback = parseRollbackRequest(await request.json().catch(() => undefined));
  if (rollback === undefined) {
    return new Response("malformed rollback", { status: BAD_REQUEST });
  }
  const { route, hash } = rollback;
  const artifact = await studioStore().read(hash);
  if (artifact === null) {
    return new Response(`no artifact ${hash}`, { status: BAD_REQUEST });
  }
  if (artifact.route !== route) {
    return new Response(`${hash} was compiled for ${artifact.route}, not ${route}`, {
      status: BAD_REQUEST,
    });
  }
  const verdict = checkRollback(artifact, studioConfig.registry);
  if (!verdict.compatible) {
    const issues = toDriftIssues(verdict.drifted, artifact.blockVersions, studioConfig.registry);
    return Response.json({ ok: false, issues }, { status: UNPROCESSABLE });
  }
  await movePointerThroughOrigin(route, hash);
  return Response.json({ ok: true, hash, url: new URL(route, consumerOrigin()).href });
}
