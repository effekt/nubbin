import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BrokenBlock } from "./BrokenBlock";

test("names the block and says where the fix lives", () => {
  render(<BrokenBlock name="OldHero" />);
  expect(screen.getByText(/OldHero can’t render — its current values break it\./)).toBeDefined();
  expect(screen.getByText("Fix the fields, or remove the block.")).toBeDefined();
});

test("speaks in a glyph plus words plus a border — never a hue alone", () => {
  const { container } = render(<BrokenBlock name="Prose" />);
  const glyph = container.querySelector("[aria-hidden='true']");
  expect(glyph?.textContent).toContain("⚠");
  expect(container.querySelector(".border-dashed")).not.toBeNull();
});

test("carries no handler of its own, so a click bubbles to Puck's node wrapper", () => {
  const select = vi.fn();
  render(
    // biome-ignore lint/a11y/noStaticElementInteractions: stands in for Puck's own node wrapper
    // biome-ignore lint/a11y/useKeyWithClickEvents: the wrapper under test is Puck's, not ours
    <div onClick={select} /* a11y-ok */>
      <BrokenBlock name="Prose" />
    </div>,
  );
  fireEvent.click(screen.getByText("Fix the fields, or remove the block."));
  expect(select).toHaveBeenCalledTimes(1);
});
