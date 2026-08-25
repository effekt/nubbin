import { nubbinRefusalResponse } from "./nubbinRefusalResponse";
import type { PublishRequestHandlerOptions } from "./publishRequestHandlerOptions.types";
import { respondToNubbinError } from "./respondToNubbinError";

const SEE_OTHER = 303;
const BAD_REQUEST = 400;
const UNPROCESSABLE = 422;

/** Creates the form-compatible publish endpoint while leaving publication and access control to the host. */
export function createPublishRequestHandler(options: PublishRequestHandlerOptions) {
  return async (request: Request): Promise<Response> => {
    const form = await request.formData();
    const route = String(form.get("route") ?? "");
    return respondToNubbinError(
      async () => {
        const published = await options.publish(route);
        if (published === undefined) {
          return new Response(`no draft for ${route}`, { status: BAD_REQUEST });
        }
        const { hash, timings } = published;
        if (request.headers.get("accept")?.includes("application/json") === true) {
          return Response.json({
            ok: true,
            hash,
            url: new URL(route, options.consumerOrigin()).href,
            timings,
          });
        }
        const back = new URL(`${options.previewPath(route)}?published=${hash}`, request.url);
        return Response.redirect(back, SEE_OTHER);
      },
      (error) => nubbinRefusalResponse(error, UNPROCESSABLE),
    );
  };
}
