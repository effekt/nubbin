/** One block as the palette lists it: the name Puck drags by, the glyph beside it, and the
 * line under it. */
export interface PaletteBlock {
  name: string;
  // `| undefined` so a lookup that found no description assigns directly under
  // `exactOptionalPropertyTypes`.
  description?: string | undefined;
  /** The block's glyph, rendered before the name; the name alone carries the semantics. */
  icon?: string | undefined;
}

/** One titled section of the palette — a category header and the blocks beneath it. */
export interface PaletteGroup {
  title: string;
  blocks: readonly PaletteBlock[];
}
