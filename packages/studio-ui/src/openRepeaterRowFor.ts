import type { FoundField } from "./foundField.types";

/** From a Studio repeater a path prefix landed on, the disclosure of the row the full path
 * descends into — clicked open when it is closed, so the row's own controls render.
 * Comes back `undefined` when the landing is not a repeater or the next path segment
 * names no row it holds, which tells the caller this is as deep as the DOM goes. */
export function openRepeaterRowFor(found: FoundField, path: string): HTMLButtonElement | undefined {
  if (path.length <= found.path.length || !found.element.matches("fieldset.nb-repeater")) {
    return undefined;
  }
  const index = Number(path.slice(found.path.length + 1).split(".")[0]);
  if (!Number.isInteger(index)) {
    return undefined;
  }
  const row = found.element.querySelectorAll(":scope > .nb-repeater-rows > .nb-repeater-row")[
    index
  ];
  const disclose = row?.querySelector<HTMLButtonElement>(".nb-repeater-disclose");
  if (disclose == null) {
    return undefined;
  }
  if (disclose.getAttribute("aria-expanded") === "false") {
    disclose.click();
  }
  return disclose;
}
