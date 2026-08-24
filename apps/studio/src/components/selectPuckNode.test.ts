import type { PuckAction } from "@measured/puck";
import { expect, test } from "vitest";
import { selectPuckNode } from "./selectPuckNode";

function puckRecording(actions: PuckAction[]) {
  return {
    getSelectorForId: (id: string) =>
      id === "hero" ? { index: 0, zone: "root:default-zone" } : undefined,
    dispatch: (action: PuckAction) => {
      actions.push(action);
    },
  };
}

test("a known node dispatches its selector as the selected item", () => {
  const actions: PuckAction[] = [];
  expect(selectPuckNode(puckRecording(actions), "hero")).toBe(true);
  expect(actions).toEqual([
    { type: "setUi", ui: { itemSelector: { index: 0, zone: "root:default-zone" } } },
  ]);
});

test("a node the data no longer holds dispatches nothing", () => {
  const actions: PuckAction[] = [];
  expect(selectPuckNode(puckRecording(actions), "gone")).toBe(false);
  expect(actions).toEqual([]);
});
