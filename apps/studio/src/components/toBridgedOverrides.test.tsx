import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { toBridgedOverrides } from "./toBridgedOverrides";

afterEach(() => {
  vi.unstubAllGlobals();
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

function renderPuck(apiRef: { current: (() => PuckApi) | undefined }) {
  return render(
    <Puck
      config={{ components: { Hero: { fields: {}, render: () => <div /> } } }}
      data={{ content: [{ type: "Hero", props: { id: "hero" } }], root: { props: {} } }}
      overrides={toBridgedOverrides(
        apiRef,
        { route: "/", routes: ["/", "/live"] },
        () => undefined,
        [{ title: "Content", blocks: [{ name: "Hero", description: "The opening statement." }] }],
        {},
      )}
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

test("the header publish control is the studio's button and posts the publish", async () => {
  const calls: string[] = [];
  vi.stubGlobal("fetch", (url: string) => {
    calls.push(url);
    return Promise.resolve(
      Response.json({ ok: true, hash: "abc123", url: "http://localhost:3000/" }),
    );
  });
  renderPuck({ current: undefined });
  const control = screen.getByRole("button", { name: "Publish changes" });
  expect(control.tagName).toBe("BUTTON");
  fireEvent.click(control);
  await waitFor(() => {
    expect(calls).toContain("/api/publish");
  });
});

test("the header carries the history chevron as its own closed disclosure", () => {
  renderPuck({ current: undefined });
  const toggle = screen.getByRole("button", { name: "Publish history and rollback" });
  expect(toggle.tagName).toBe("BUTTON");
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
});

test("the header carries the Pages switcher beside the publish button", () => {
  renderPuck({ current: undefined });
  fireEvent.click(screen.getByRole("button", { name: /Pages/ }));
  expect(screen.getByRole("link", { name: "/live" }).getAttribute("href")).toBe("/edit/live");
});
