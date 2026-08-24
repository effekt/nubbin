import { describe, expect, test } from "vitest";
import { draftPath } from "./draftPath";

describe("draftPath", () => {
  test("encodes the route, so its slashes cannot become directories", () => {
    expect(draftPath("/dispatches/tide-tables")).toContain("%2Fdispatches%2Ftide-tables.json");
  });

  test("lives in the drafts directory beside the store", () => {
    expect(draftPath("/")).toContain(".nubbin-drafts");
  });
});
