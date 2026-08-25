import type { PuckApi } from "@measured/puck";
import { Puck } from "@measured/puck";
import { editorStatusStore } from "@nubbin/studio";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { testStudioOperations } from "../testing/testStudioOperations";
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
        testStudioOperations,
        () => undefined,
        [{ title: "Content", blocks: [{ name: "Hero", description: "The opening statement." }] }],
        {},
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

test("the toolbar arranges the specimen's row: name, route pill, chips, undo and redo", () => {
  renderPuck({ current: undefined });
  const toolbar = screen.getByRole("region", { name: "Studio toolbar" });
  expect(toolbar.querySelector(".nb-tb-docname")?.textContent).toBe("Home");
  expect(toolbar.querySelector(".nb-tb-docaddr")?.textContent).toBe("/");
  const chips = screen.getByRole("group", { name: "Canvas width" });
  const labels = [...chips.querySelectorAll("button")].map((chip) => chip.textContent);
  expect(labels).toEqual(["sm", "md", "lg", "xl", "2xl"]);
  expect(screen.getByRole("button", { name: "Undo" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByRole("button", { name: "Redo" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByRole("link", { name: "Preview" }).getAttribute("href")).toBe("/preview");
});

test("a viewport chip presses itself and moves the canvas width through setUi", () => {
  const apiRef: { current: (() => PuckApi) | undefined } = { current: undefined };
  renderPuck(apiRef);
  const chip = screen.getByRole("button", { name: "md" });
  expect(chip.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(chip);
  expect(chip.getAttribute("aria-pressed")).toBe("true");
});

test("both sidebar toggles flip their panels through setUi", () => {
  renderPuck({ current: undefined });
  const left = screen.getByRole("button", { name: "Toggle blocks sidebar" });
  expect(left.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(left);
  expect(left.getAttribute("aria-pressed")).toBe("false");
  const right = screen.getByRole("button", { name: "Toggle inspector sidebar" });
  expect(right.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(right);
  expect(right.getAttribute("aria-pressed")).toBe("false");
});
