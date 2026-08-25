import type { HistoryOperation } from "./historyOperation.types";

/** Host seams required by the framework-neutral history handler. */
export interface HistoryRequestHandlerOptions<Context> {
  readonly route: (context: Context) => string | Promise<string>;
  readonly history: HistoryOperation;
}
