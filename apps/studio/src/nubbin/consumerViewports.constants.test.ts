import { expect, test } from "vitest";
import { CONSUMER_VIEWPORTS } from "./consumerViewports.constants";

test("the presets are Tailwind's documented defaults, narrowest first", () => {
  expect(CONSUMER_VIEWPORTS.map((viewport) => viewport.label)).toEqual([
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
  ]);
  expect(CONSUMER_VIEWPORTS.map((viewport) => viewport.width)).toEqual([
    640, 768, 1024, 1280, 1536,
  ]);
});

test("every chip shows its breakpoint's name and leaves height to the content", () => {
  for (const viewport of CONSUMER_VIEWPORTS) {
    // Puck's viewport button renders `icon`, not `label` — an icon string outside its icon
    // map renders verbatim, which is what turns the button into a named chip.
    expect(viewport.icon).toBe(viewport.label);
    expect(viewport.height).toBe("auto");
  }
});
