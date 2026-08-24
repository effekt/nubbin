import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CanvasActionBar } from "./CanvasActionBar";

function renderInOverlay(label?: string) {
  const overlay = document.createElement("div");
  overlay.setAttribute("data-puck-overlay", "true");
  document.body.appendChild(overlay);
  const berth = document.createElement("div");
  overlay.appendChild(berth);
  const result = render(
    <CanvasActionBar label={label} parentAction={null}>
      <button type="button">Duplicate</button>
    </CanvasActionBar>,
    { container: berth },
  );
  return { overlay, result };
}

test("the name escapes the bar: the tag lands on the overlay root, outside the chip", () => {
  const { overlay } = renderInOverlay("Hero");
  const tag = overlay.querySelector(":scope > .nb-ov-tag");
  expect(tag?.textContent).toBe("Hero");
  expect(tag?.closest(".nb-ov-chip")).toBeNull();
  expect(screen.getByRole("button", { name: "Duplicate" }).closest(".nb-ov-chip")).not.toBeNull();
});

test("no label means no tag, and the actions chip still stands", () => {
  const { overlay } = renderInOverlay(undefined);
  expect(overlay.querySelector(".nb-ov-tag")).toBeNull();
  expect(screen.getByRole("button", { name: "Duplicate" })).toBeDefined();
});

test("with no overlay root to escape to, the tag is withheld rather than misplaced", () => {
  render(
    <CanvasActionBar label="Hero" parentAction={null}>
      <button type="button">Delete</button>
    </CanvasActionBar>,
  );
  expect(document.querySelector(".nb-ov-tag")).toBeNull();
  expect(screen.getByRole("button", { name: "Delete" })).toBeDefined();
});
