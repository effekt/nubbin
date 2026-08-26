import { routeFromSlug } from "@nubbin/next";
import { createHistoryRequestHandler } from "@nubbin/studio";
import { historyPayload } from "../../../../nubbin/historyPayload";
import { studioStore } from "../../../../nubbin/studioStore";

/**
 * One route's publish history: the hash the pointer serves now and its moves, newest first,
 * capped at the last twenty with `total` carrying the uncapped count. A store that keeps no
 * history answers `moves: null` — the absence is the store's to have and the panel's to
 * name, never a crash on an absent method. Unauthenticated like its siblings: the studio
 * deploys behind the consumer's own gate.
 */
export const GET = createHistoryRequestHandler<{ params: Promise<{ slug?: string[] }> }>({
  route: async ({ params }) => routeFromSlug((await params).slug),
  load: (route) => historyPayload(studioStore(), route),
});
