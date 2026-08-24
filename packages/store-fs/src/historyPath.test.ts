import { describe, expect, test } from "vitest";
import { historyPath } from "./historyPath";

describe("historyPath", () => {
  test("keeps the log out of the routes directory manifest() lists", () => {
    expect(historyPath("/root", "/x")).not.toContain("routes");
  });

  test("keeps the path separator out of the filename, so routes cannot nest", () => {
    const path = historyPath("/root", "/promotions/summer");
    expect(path.split("/").pop()).toBe("%2Fpromotions%2Fsummer.jsonl");
  });
});
