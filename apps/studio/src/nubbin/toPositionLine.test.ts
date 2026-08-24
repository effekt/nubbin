import { expect, test } from "vitest";
import { toPositionLine } from "./toPositionLine";

test("a zero-based index reads as the position an author counts to", () => {
  expect(toPositionLine(0, "Page body")).toBe("1st block in Page body");
  expect(toPositionLine(1, "Page body")).toBe("2nd block in Page body");
});

test("the area label lands verbatim", () => {
  expect(toPositionLine(2, "SectionStack sections")).toBe("3rd block in SectionStack sections");
});
