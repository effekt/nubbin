import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { StatusItem } from "./StatusItem";

test("a stateful segment carries its dot, hidden from assistive tech", () => {
  const { container } = render(<StatusItem segment={{ kind: "ok", text: "Preview connected" }} />);
  expect(screen.getByText("Preview connected")).toBeDefined();
  const dot = container.querySelector(".nb-statusbar-dot-ok");
  expect(dot).not.toBeNull();
  expect(dot?.getAttribute("aria-hidden")).toBe("true");
});

test("a plain segment is words alone", () => {
  const { container } = render(<StatusItem segment={{ kind: "plain", text: "Autosaved" }} />);
  expect(screen.getByText("Autosaved")).toBeDefined();
  expect(container.querySelector(".nb-statusbar-dot")).toBeNull();
});
