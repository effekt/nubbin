import { NubbinError } from "@nubbin/core";
import type { CreateRouteOperation } from "./createRouteOperation.types";
import { parseRouteCreateRequest } from "./parseRouteCreateRequest";

const CREATED = 201;
const BAD_REQUEST = 400;
const CONFLICT = 409;

/** Creates a Web-standard handler while leaving storage and access control to the host. */
export function createRouteRequestHandler(create: CreateRouteOperation) {
  return async (request: Request): Promise<Response> => {
    const body: unknown = await request.json().catch(() => undefined);
    const parsed = parseRouteCreateRequest(body);
    if (parsed === undefined) {
      return new Response("malformed create", { status: BAD_REQUEST });
    }
    try {
      if ((await create(parsed.route)) === "exists") {
        return new Response(`a page already lives at ${parsed.route}`, { status: CONFLICT });
      }
      return Response.json({ ok: true, route: parsed.route }, { status: CREATED });
    } catch (error) {
      if (error instanceof NubbinError) {
        return new Response(error.message, { status: BAD_REQUEST });
      }
      throw error;
    }
  };
}
