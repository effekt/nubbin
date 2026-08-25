/** A strict structural mirror of Puck's `Data`, local to the studio. Puck's own `Data` types
 * `props` as `any` through `DefaultComponentProps`, which would turn every prop the adapter
 * walks into an unchecked value — the mirror keeps `unknown` so each read is judged.
 * `puckData.types.test.ts` proves assignability with the real types in both directions, so a
 * Puck upgrade that changes the shape fails the build rather than drifting silently. */

/** One component in Puck's tree. `props.id` is Puck's handle for it; a slot-typed prop holds
 * the slot's children inline as a `PuckComponentData[]`. */
export interface PuckComponentData {
  type: string;
  props: { id: string; [key: string]: unknown };
}

/** Puck's whole editor state for one page: top-level components in order, and the page-level
 * fields Puck hangs off `root.props` — where the adapter keeps `DocumentMeta`. `zones` is
 * Puck's legacy `DropZone` storage; the studio's config is slot-fields-only, so nothing here
 * should ever populate it, and `fromPuckData` refuses a `Data` that arrives with one filled. */
export interface PuckData {
  content: PuckComponentData[];
  root: { props?: Record<string, unknown> };
  zones?: Record<string, PuckComponentData[]>;
}
