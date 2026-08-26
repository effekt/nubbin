/** The reset key `toPuckRender` puts on a block's error boundary: the props' own values,
 * serialized with functions dropped — a slot rendered to an element keeps its shape, and a
 * fixed field changes the key, so the boundary remounts and retries the real component the
 * moment the author's edit arrives. A value a serializer cannot walk — a cycle — yields the
 * constant key instead: the boundary then never auto-resets, which degrades to a reload,
 * never to a crash. */
export function toBlockResetKey(props: Record<string, unknown>): string {
  try {
    return (
      JSON.stringify(props, (_key, value) => (typeof value === "function" ? undefined : value)) ??
      ""
    );
  } catch {
    return "";
  }
}
