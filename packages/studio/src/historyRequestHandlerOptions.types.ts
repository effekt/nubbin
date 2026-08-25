import type { HistoryOperation } from "./historyOperation.types";
import type { RoutedRequestHandlerOptions } from "./routedRequestHandlerOptions.types";

/** Host seams required by the framework-neutral history handler. */
export type HistoryRequestHandlerOptions<Context> = RoutedRequestHandlerOptions<
  Context,
  Awaited<ReturnType<HistoryOperation>>
>;
