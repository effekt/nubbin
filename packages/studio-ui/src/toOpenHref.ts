import { toLinkKind } from "./toLinkKind";

/** The URL the link control's Open affordance points at, or `undefined` when there is
 * nothing honest to open: an absolute URL opens as-is, a root-relative path resolves
 * against the consumer origin the server handed the editor, and a relative path with no
 * origin to resolve against opens nowhere rather than against the studio's own port. */
export function toOpenHref(value: string, consumerOrigin: string | undefined): string | undefined {
  const kind = toLinkKind(value);
  if (kind === "absolute") {
    return value;
  }
  if (kind === "relative" && consumerOrigin !== undefined) {
    return new URL(value, consumerOrigin).href;
  }
  return undefined;
}
