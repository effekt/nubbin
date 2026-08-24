/** A minimal structural mirror of Puck's `Data`, local to the studio: Puck is not yet a
 * dependency ([#532](https://github.com/effekt/nubbin/issues/532) installs it and reconciles
 * these with the real types), and the adapter only needs the shape it walks — `content` in
 * root order, children inline in slot-typed props. */

/** One component in Puck's tree. `props.id` is Puck's handle for it; a slot-typed prop holds
 * the slot's children inline as a `PuckComponentData[]`. */
export interface PuckComponentData {
  type: string;
  props: { id: string; [key: string]: unknown };
}

/** Puck's whole editor state for one page: top-level components in order, and the page-level
 * fields Puck hangs off `root.props` — where the adapter keeps `DocumentMeta`. */
export interface PuckData {
  content: PuckComponentData[];
  root: { props?: Record<string, unknown> };
}
