import type { HistoryReply } from "./historyReply.types";

/** Host operation used by the reusable history HTTP boundary. */
export type HistoryOperation = (route: string) => HistoryReply | Promise<HistoryReply>;
