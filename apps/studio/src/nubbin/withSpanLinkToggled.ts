import type { RichTextSpan } from "@nubbin/core";

/** The span with its link toggled: an unlinked span gains an empty `href` for the author
 * to fill, and a linked one drops the key entirely rather than keeping a dead target. */
export function withSpanLinkToggled(span: RichTextSpan): RichTextSpan {
  if (span.href === undefined) return { ...span, href: "" };
  const { href: _dropped, ...rest } = span;
  return rest;
}
