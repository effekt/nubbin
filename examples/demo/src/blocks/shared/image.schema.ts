import { z } from "zod";

/** A displayable image as inert data — a block renders it, the schema never carries a node.
 * Both fields refuse the empty string: `<img src="">` re-requests the page itself, and an
 * image whose alt is empty on purpose is a decision `alt=""` in a component makes, never
 * content. */
export const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});
