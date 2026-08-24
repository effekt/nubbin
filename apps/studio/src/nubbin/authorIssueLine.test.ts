import { expect, test } from "vitest";
import { authorIssueLine } from "./authorIssueLine";

test("block, field and message compose into one line", () => {
  expect(
    authorIssueLine({
      nodeId: "n1",
      blockName: "Hero",
      fieldLabel: "Headline",
      message: "maximum 80 characters",
    }),
  ).toBe("Hero — Headline: maximum 80 characters");
});

test("a missing label leaves the block naming the line", () => {
  expect(
    authorIssueLine({ nodeId: "n1", blockName: "Hero", message: "props must be an object" }),
  ).toBe("Hero: props must be an object");
});

test("a missing block leaves the raw path naming the line", () => {
  expect(authorIssueLine({ fieldLabel: "legacy.knob", message: "unknown" })).toBe(
    "legacy.knob: unknown",
  );
});

test("a bare message stands alone", () => {
  expect(authorIssueLine({ message: "route is taken" })).toBe("route is taken");
});
