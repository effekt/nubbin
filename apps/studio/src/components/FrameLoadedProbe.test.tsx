import { render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { editorStatusStore } from "./editorStatusStore";
import { FrameLoadedProbe } from "./FrameLoadedProbe";

afterEach(() => {
  editorStatusStore.set({ issues: [], issuesOpen: false, published: false });
});

test("no document handed over means no claim, and the preview still renders", () => {
  render(<FrameLoadedProbe>inside the frame</FrameLoadedProbe>);
  expect(screen.getByText("inside the frame")).toBeDefined();
  expect(editorStatusStore.get().frameLoaded).toBeUndefined();
});

test("the frame handing over its document is the proof the status records", () => {
  render(<FrameLoadedProbe document={document}>inside the frame</FrameLoadedProbe>);
  expect(editorStatusStore.get().frameLoaded).toBe(true);
});
