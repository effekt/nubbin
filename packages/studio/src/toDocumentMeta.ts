import type { DocumentMeta } from "@nubbin/core";

/** `DocumentMeta` read back out of Puck's `root.props`. Each field is kept only when it is
 * the string the contract asks for; `title` is required on every page, so a missing or
 * non-string one falls back to the prior draft's rather than inventing a name. An optional
 * field an author emptied arrives as `""` and folds back to absent — the artifact carries
 * no field the page does not actually say, and `""` is not a description. */
export function toDocumentMeta(
  props: Record<string, unknown> | undefined,
  prior: DocumentMeta,
): DocumentMeta {
  const meta: DocumentMeta = {
    title: typeof props?.title === "string" ? props.title : prior.title,
  };
  if (typeof props?.description === "string" && props.description !== "") {
    meta.description = props.description;
  }
  if (typeof props?.robots === "string" && props.robots !== "") {
    meta.robots = props.robots;
  }
  if (typeof props?.canonical === "string" && props.canonical !== "") {
    meta.canonical = props.canonical;
  }
  return meta;
}
