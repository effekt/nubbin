import { createParsedRequestHandler } from "./createParsedRequestHandler";
import type { CreateRouteOperation } from "./createRouteOperation.types";
import { parseRouteCreateRequest } from "./parseRouteCreateRequest";
import { respondToNubbinError } from "./respondToNubbinError";

const CREATED = 201;
const BAD_REQUEST = 400;
const CONFLICT = 409;

/** Creates a Web-standard handler while leaving storage and access control to the host. */
export function createRouteRequestHandler(create: CreateRouteOperation) {
  return createParsedRequestHandler(parseRouteCreateRequest, "malformed create", (parsed) =>
    respondToNubbinError(
      async () => {
        if ((await create(parsed.route)) === "exists") {
          return new Response(`a page already lives at ${parsed.route}`, { status: CONFLICT });
        }
        return Response.json({ ok: true, route: parsed.route }, { status: CREATED });
      },
      (error) => new Response(error.message, { status: BAD_REQUEST }),
    ),
  );
}
