import type { DocumentMeta } from "@nubbin/core";

/** `DocumentMeta` read back out of Puck's `root.props`. Each field is kept only when it is
 * the string the contract asks for; `title` is required on every page, so a missing or
 * non-string one falls back to the prior draft's rather than inventing a name. */
export function toDocumentMeta(
  props: Record<string, unknown> | undefined,
  prior: DocumentMeta,
): DocumentMeta {
  const meta: DocumentMeta = {
    title: typeof props?.title === "string" ? props.title : prior.title,
  };
  if (typeof props?.description === "string") meta.description = props.description;
  if (typeof props?.robots === "string") meta.robots = props.robots;
  if (typeof props?.canonical === "string") meta.canonical = props.canonical;
  return meta;
}
