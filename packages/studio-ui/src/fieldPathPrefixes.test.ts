import { expect, test } from "vitest";
import { fieldPathPrefixes } from "./fieldPathPrefixes";

test("a nested path lists itself first, then each containing prefix", () => {
  expect(fieldPathPrefixes("stats.0.label")).toEqual(["stats.0.label", "stats.0", "stats"]);
});

test("a top-level path is its own only prefix", () => {
  expect(fieldPathPrefixes("headline")).toEqual(["headline"]);
});
