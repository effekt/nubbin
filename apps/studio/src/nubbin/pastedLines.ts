/** A pasted clipboard's plain text as the lines the control folds it to: split on any line
 * ending, trimmed, blanks dropped. Only `text/plain` ever reaches this — markup on the
 * clipboard arrives as whatever characters it renders to, never as structure. */
export function pastedLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
