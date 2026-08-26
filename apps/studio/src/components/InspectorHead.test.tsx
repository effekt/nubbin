import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { PuckApiBridge, selectPuckNode } from "@nubbin/studio-ui";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { InspectorHead } from "./InspectorHead";

async function renderSelected(nodeId: string | undefined) {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  render(
    <Puck
      config={{ components: { Hero: { fields: {}, render: () => <div /> } } }}
      data={{
        content: [
          { type: "Hero", props: { id: "hero-1" } },
          { type: "Hero", props: { id: "hero-2" } },
        ],
        root: { props: {} },
      }}
      overrides={{
        fields: () => <InspectorHead icons={{ Hero: "hero" }} />,
        puck: ({ children }) => (
          <>
            <PuckApiBridge apiRef={apiRef} />
            {children}
          </>
        ),
      }}
    />,
  );
  await waitFor(() => {
    expect(apiRef.current).toBeDefined();
  });
  if (nodeId !== undefined) {
    act(() => {
      const api = apiRef.current;
      if (api !== undefined) {
        selectPuckNode(api(), nodeId);
      }
    });
  }
}

function head(): HTMLElement {
  const found = document.querySelector(".nb-insp-head");
  if (!(found instanceof HTMLElement)) {
    throw new Error("the inspector head did not render");
  }
  return found;
}

test("the head names the selected block and counts its place in the page body", async () => {
  await renderSelected("hero-2");
  await waitFor(() => {
    expect(within(head()).getByRole("heading", { name: "Hero" })).toBeDefined();
  });
  expect(screen.getByText("2nd block in Page body")).toBeDefined();
});

test("with nothing selected the head says the panel edits the page", async () => {
  await renderSelected(undefined);
  expect(within(head()).getByRole("heading", { name: "Page" })).toBeDefined();
  expect(screen.queryByText(/block in/)).toBeNull();
});
