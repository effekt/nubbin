import type { HistoryRequestHandlerOptions } from "./historyRequestHandlerOptions.types";

/** Creates a history endpoint while leaving route conventions, storage, and access control to the host. */
export function createHistoryRequestHandler<Context>(
  options: HistoryRequestHandlerOptions<Context>,
) {
  return async (_request: Request, context: Context): Promise<Response> => {
    const route = await options.route(context);
    return Response.json(await options.history(route));
  };
}
