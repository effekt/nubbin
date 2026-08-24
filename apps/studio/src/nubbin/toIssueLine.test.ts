import { expect, test } from "vitest";
import { toIssueLine } from "./toIssueLine";

test("a pathed issue puts the field first", () => {
  expect(toIssueLine({ message: "expected a string", path: "headline" })).toBe(
    "headline: expected a string",
  );
});

test("an unpathed issue is its message alone", () => {
  expect(toIssueLine({ message: "slot holds too few children" })).toBe(
    "slot holds too few children",
  );
});

test("a shape with no message stringifies rather than throwing", () => {
  expect(toIssueLine({ code: "mystery" })).toBe('{"code":"mystery"}');
  expect(toIssueLine("plain text")).toBe("plain text");
});
