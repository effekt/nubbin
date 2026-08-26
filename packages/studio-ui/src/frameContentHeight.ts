/** The height of the content inside a same-origin iframe, or `undefined` while there is
 * nothing measurable — no document yet, or a document that has not laid out. The body is
 * what is measured: the root element's `scrollHeight` never reads below the iframe's own
 * viewport, so a short block would circularly "measure" whatever height the iframe was
 * given while loading. Zero is reported as unmeasured on purpose — sizing a panel to an
 * unrendered document would collapse it, and the caller's fallback height is the better
 * answer until load fires again. */
export function frameContentHeight(frame: HTMLIFrameElement): number | undefined {
  const measured = frame.contentDocument?.body?.scrollHeight ?? 0;
  return measured > 0 ? measured : undefined;
}
