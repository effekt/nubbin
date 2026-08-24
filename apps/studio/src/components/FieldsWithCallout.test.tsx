import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { FieldsWithCallout } from "./FieldsWithCallout";
import { PuckApiBridge } from "./PuckApiBridge";
import { selectPuckNode } from "./selectPuckNode";

afterEach(() => {
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("the callout tops the fields panel exactly while the selected node has issues", async () => {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  editorStatusStore.set({
    issues: [
      { nodeId: "hero", blockName: "Hero", fieldLabel: "Headline", message: "over the limit" },
      { nodeId: "hero", blockName: "Hero", fieldLabel: "Eyebrow", message: "empty" },
    ],
    issuesOpen: false,
    published: false,
  });
  render(
    <Puck
      config={{ components: { Hero: { fields: {}, render: () => <div /> } } }}
      data={{ content: [{ type: "Hero", props: { id: "hero" } }], root: { props: {} } }}
      overrides={{
        fields: ({ children }) => <FieldsWithCallout>{children}</FieldsWithCallout>,
        puck: ({ children }) => (
          <>
            <PuckApiBridge apiRef={apiRef} />
            {children}
          </>
        ),
      }}
    />,
  );
  expect(screen.queryByText(/things to fix/)).toBeNull();
  await waitFor(() => {
    expect(apiRef.current).toBeDefined();
  });
  act(() => {
    const api = apiRef.current;
    if (api !== undefined) {
      selectPuckNode(api(), "hero");
    }
  });
  const callout = await screen.findByText(/Hero has 2 things to fix\./);
  expect(callout.textContent).toContain("the page just can't go live");
});
