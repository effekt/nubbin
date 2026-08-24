import { describe, expect, test } from "vitest";
import { openLinkLabel } from "./openLinkLabel";

describe("openLinkLabel", () => {
  test("names the destination the affordance opens", () => {
    expect(openLinkLabel("http://localhost:3100/dispatches")).toBe(
      "Open http://localhost:3100/dispatches in a new tab",
    );
  });
});
