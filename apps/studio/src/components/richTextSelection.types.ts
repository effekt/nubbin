/** Which span the fixed toolbar's toggles apply to: a block index and a span index within
 * it. Selection follows focus and is sticky — it survives the focus moving to the toolbar
 * itself, so a toggle lands on the span the author was just typing in. */
export interface RichTextSelection {
  block: number;
  span: number;
}
