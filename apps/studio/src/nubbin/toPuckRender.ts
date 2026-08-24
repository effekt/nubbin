import { type ComponentType, createElement, type ReactElement } from "react";
import { withRenderedSlots } from "./withRenderedSlots";

/** One Puck `render` for a block: the demo's own component from the registry, given Puck's
 * live props with each slot rendered to an element first — so the canvas shows exactly what
 * `Renderer` would show, through the same component. */
export function toPuckRender(
  component: ComponentType<Record<string, unknown>>,
  slotNames: readonly string[],
): (props: Record<string, unknown>) => ReactElement {
  return (props) => createElement(component, withRenderedSlots(props, slotNames));
}
