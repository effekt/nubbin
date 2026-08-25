import { createRouteRequestHandler } from "@nubbin/studio";
import { createDraft } from "../../../nubbin/createDraft";

/**
 * Creates a page: a blank draft written at a new route, which `/edit` serves like any
 * other. The route's judge is core's — a malformed one answers 400 carrying the compiler's
 * own message, so the form shows the same words publish would have used — and a route the
 * studio already edits, fixture or draft, is a conflict rather than a silent overwrite.
 * Unauthenticated like its siblings: the studio deploys behind the consumer's own gate.
 */
export const POST = createRouteRequestHandler((route) =>
  "exists" in createDraft(route) ? "exists" : "created",
);
