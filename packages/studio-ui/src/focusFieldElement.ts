const FOCUSABLE = "input, textarea, select, button, a[href], [tabindex]";

/** Lands the author on a resolved Studio control: scrolled to the middle of its pane and given
 * focus, so the visible ring says where the fix goes. A container that cannot take focus
 * natively — a repeater's or fieldset's own element — is made focusable without joining
 * the tab order, so the landing still announces itself instead of silently not happening. */
export function focusFieldElement(element: HTMLElement): void {
  element.scrollIntoView({ block: "center" });
  if (!element.matches(FOCUSABLE)) {
    element.tabIndex = -1;
  }
  element.focus();
}
