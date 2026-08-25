import type { HistoryRequestHandlerOptions } from "./historyRequestHandlerOptions.types";
import { loadRoutedValue } from "./loadRoutedValue";

/** Creates a history endpoint while leaving route conventions, storage, and access control to the host. */
export function createHistoryRequestHandler<Context>(
  options: HistoryRequestHandlerOptions<Context>,
) {
  return async (_request: Request, context: Context): Promise<Response> => {
    const { value } = await loadRoutedValue(options, context);
    return Response.json(value);
  };
}
