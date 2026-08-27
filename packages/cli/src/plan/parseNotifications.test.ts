import { describe, expect, it } from "vitest";
import { parseNotifications } from "./parseNotifications";

describe("parseNotifications", () => {
  it("reads a flag per option, in option order", () => {
    expect(parseNotifications("000")).toEqual([]);
    expect(parseNotifications("100")).toEqual(["webhook"]);
    expect(parseNotifications("010")).toEqual(["deploy"]);
    expect(parseNotifications("001")).toEqual(["workflow"]);
    expect(parseNotifications("111")).toEqual(["webhook", "deploy", "workflow"]);
  });

  it("returns null for the wrong number of flags", () => {
    expect(parseNotifications("00")).toBeNull();
    expect(parseNotifications("0000")).toBeNull();
  });

  it("returns null for a character that is neither flag", () => {
    expect(parseNotifications("10z")).toBeNull();
    expect(parseNotifications("aaa")).toBeNull();
  });
});
