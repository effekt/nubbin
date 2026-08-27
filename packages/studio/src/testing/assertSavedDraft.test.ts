import { expect, test } from "vitest";
import { assertSavedDraft } from "./assertSavedDraft";

test("accepts a saved outcome and refuses another status", () => {
  expect(() => assertSavedDraft({ status: "saved", revision: "next" })).not.toThrow();
  expect(() => assertSavedDraft({ status: "missing" })).toThrow();
});
