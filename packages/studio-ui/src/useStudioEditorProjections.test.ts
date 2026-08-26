import { createRegistry } from "@nubbin/core";
import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { useStudioEditorProjections } from "./useStudioEditorProjections";

test("derives empty chrome projections from an empty editor contract", () => {
  const { result } = renderHook(() =>
    useStudioEditorProjections({ catalog: {}, registry: createRegistry([]), viewports: [] }),
  );
  expect(result.current).toEqual({
    palette: [],
    docsByBlock: {},
    blockSlots: {},
    slotsByBlock: {},
  });
});
