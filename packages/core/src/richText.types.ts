// Semantic, never stylistic, and closed: a construct outside this set is added as a member
// deliberately, not smuggled in as markup.
/**
 * The inline emphasis a span may carry. A mark outside this set is a validation issue at the
 * mark's own path, never a dropped value.
 */
export type RichTextMark = "strong" | "em" | "code";

// Closed for the same reason the marks are.
/** The block kinds rich text is built from. A renderer maps each to an element it chooses. */
export type RichTextBlockKind = "paragraph" | "listItem";

/** A run of text and what is true of it. Inert: nothing here is parsed or evaluated at render. */
export interface RichTextSpan {
  /** The literal text of the run. Never markup — a tag here renders as the characters typed. */
  text: string;
  /** Emphasis over the whole run. Absent and empty mean the same thing: plain text. */
  marks?: readonly RichTextMark[];
  /** Link target for the whole run. Absent leaves the run unlinked. */
  href?: string;
}

/** One block of a rich-text value: its kind, and the ordered spans it reads as. */
export interface RichTextBlock {
  /** What the block is, which decides how a renderer wraps its spans. */
  kind: RichTextBlockKind;
  /** The runs the block reads as, in order. An empty array is a block with no text. */
  spans: readonly RichTextSpan[];
}

/**
 * An ordered array of blocks — the whole value a `richText()` field holds. An empty array is a
 * valid empty document.
 */
export type RichText = readonly RichTextBlock[];
