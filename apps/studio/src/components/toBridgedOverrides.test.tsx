import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { toBridgedOverrides } from "./toBridgedOverrides";

function renderPuck(
  apiRef: { current: (() => PuckApi) | undefined },
  onPublish: () => void = () => undefined,
) {
  return render(
    <Puck
      config={{ components: { Hero: { fields: {}, render: () => <div /> } } }}
      data={{ content: [{ type: "Hero", props: { id: "hero" } }], root: { props: {} } }}
      overrides={toBridgedOverrides(apiRef, onPublish, { route: "/", routes: ["/", "/live"] })}
    />,
  );
}

test("the bridge hands Puck's API out of the provider, ids resolvable", async () => {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  renderPuck(apiRef);
  await waitFor(() => {
    expect(apiRef.current).toBeDefined();
  });
  const selector = apiRef.current?.().getSelectorForId("hero");
  expect(selector).toMatchObject({ index: 0 });
});

test("the header publish control is the studio's button and triggers the flow", () => {
  const onPublish = vi.fn();
  renderPuck({ current: undefined }, onPublish);
  const control = screen.getByRole("button", { name: "Publish" });
  expect(control.tagName).toBe("BUTTON");
  fireEvent.click(control);
  expect(onPublish).toHaveBeenCalledTimes(1);
});

test("the header carries the Pages switcher beside the publish button", () => {
  renderPuck({ current: undefined });
  fireEvent.click(screen.getByRole("button", { name: /Pages/ }));
  expect(screen.getByRole("link", { name: "/live" }).getAttribute("href")).toBe("/edit/live");
});
