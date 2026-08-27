import { describe, expect, it } from "vitest";
import { isPlanFieldValid } from "./isPlanFieldValid";

describe("isPlanFieldValid", () => {
  it("accepts a value the field declares", () => {
    expect(isPlanFieldValid("framework", "next")).toBe(true);
    expect(isPlanFieldValid("network", "isolated")).toBe(true);
  });

  it("refuses a value from another field", () => {
    expect(isPlanFieldValid("framework", "self")).toBe(false);
    expect(isPlanFieldValid("studio", "next")).toBe(false);
  });

  it("refuses a value that is not a string", () => {
    expect(isPlanFieldValid("studio", undefined)).toBe(false);
    expect(isPlanFieldValid("studio", null)).toBe(false);
    expect(isPlanFieldValid("studio", 1)).toBe(false);
  });

  it("reads notifications as a subset", () => {
    expect(isPlanFieldValid("notifications", [])).toBe(true);
    expect(isPlanFieldValid("notifications", ["deploy", "workflow"])).toBe(true);
    expect(isPlanFieldValid("notifications", ["email"])).toBe(false);
    expect(isPlanFieldValid("notifications", "webhook")).toBe(false);
  });
});
