import { type ComponentType, createElement, type ReactElement } from "react";
import { BlockBoundary } from "./BlockBoundary";
import { toBlockResetKey } from "./toBlockResetKey";
import { withRenderedSlots } from "./withRenderedSlots";

/** One Puck `render` for a block: the demo's own component from the registry, given Puck's
 * live props with each slot rendered to an element first — so the canvas shows exactly what
 * `Renderer` would show, through the same component — inside a `BlockBoundary`, so a
 * component that throws on its draft props degrades to the marked placeholder instead of
 * taking the editor down. The boundary is keyed by the props' values: a fixed field
 * remounts it, and the real block renders again with no reload. */
export function toPuckRender(
  blockName: string,
  component: ComponentType<Record<string, unknown>>,
  slotNames: readonly string[],
): (props: Record<string, unknown>) => ReactElement {
  return (props) => {
    const rendered = withRenderedSlots(props, slotNames);
    return createElement(
      BlockBoundary,
      { blockName, key: toBlockResetKey(rendered) },
      createElement(component, rendered),
    );
  };
}
