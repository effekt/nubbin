import { isPuckComponentData } from "./isPuckComponentData";
import type { PuckComponentData } from "./puckData.types";

/** A slot entry's value as the components it holds. A slot already judged one still carries
 * `unknown`s from the props bag, so each child is checked — a value in a slot that is not a
 * component is corruption worth stopping on, not something to drop or pass through. */
export function toPuckChildren(value: unknown): PuckComponentData[] {
  const children = Array.isArray(value) ? value : [value];
  return children.map((child) => {
    if (!isPuckComponentData(child)) {
      throw new Error(`a slot holds a value that is not a component: ${JSON.stringify(child)}`);
    }
    return child;
  });
}
