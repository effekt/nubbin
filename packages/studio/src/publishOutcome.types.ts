import type { PublishTimings } from "./publishTimings.types";

/**
 * What a publish attempt came back as. `ok` carries the hash the route now serves and the
 * live page's URL, both built by the endpoint — the server holds the consumer-origin seam,
 * so no client rebuilds the address — and, when the reply carried them, the three steps'
 * durations as the server measured them; a refusal carries the issues still raw off the
 * wire — the editor translates them with the catalog and draft it alone holds.
 */
export type PublishOutcome =
  | {
      readonly ok: true;
      readonly route: string;
      readonly hash: string;
      readonly url: string;
      readonly timings?: PublishTimings;
    }
  | { readonly ok: false; readonly issues: readonly unknown[] };

/** The landed half of the outcome alone — what the publish report renders. */
export type PublishSuccess = Extract<PublishOutcome, { ok: true }>;
