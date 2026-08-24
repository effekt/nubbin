import { type ComponentType, createElement } from "react";

/** Puck hands `render` each slot-typed prop as a component to place; the demo's blocks take
 * the already-rendered children under the same name, the way `Renderer` passes them. This
 * bridges the two: each named slot's component becomes an element, and Puck's own `puck` and
 * `editMode` props are dropped so nothing Puck-shaped reaches a block. */
export function withRenderedSlots(
  props: Record<string, unknown>,
  slotNames: readonly string[],
): Record<string, unknown> {
  const { puck: _puck, editMode: _editMode, ...rendered } = props;
  for (const name of slotNames) {
    const value = rendered[name];
    if (typeof value === "function") {
      rendered[name] = createElement(value as ComponentType);
    }
  }
  return rendered;
}
