/** One block as the palette lists it: the name Puck drags by, and the line under it. */
export interface PaletteBlock {
  name: string;
  // `| undefined` so a lookup that found no description assigns directly under
  // `exactOptionalPropertyTypes`.
  description?: string | undefined;
}

/** One titled section of the palette — a category header and the blocks beneath it. */
export interface PaletteGroup {
  title: string;
  blocks: readonly PaletteBlock[];
}
