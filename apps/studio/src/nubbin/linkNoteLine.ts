/** The link control's quiet inline note for a value that is not yet a link — phrased as
 * what would make it one, never as an error, because the draft saves either way and the
 * schema stays the judge at publish. */
export function linkNoteLine(): string {
  return "Not a link yet — use a full https:// address or a path starting with /.";
}
