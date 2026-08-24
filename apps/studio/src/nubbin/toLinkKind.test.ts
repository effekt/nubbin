import { describe, expect, test } from "vitest";
import { toLinkKind } from "./toLinkKind";

describe("toLinkKind", () => {
  test("reads a parseable http or https URL as absolute", () => {
    expect(toLinkKind("https://example.com/dispatches")).toBe("absolute");
    expect(toLinkKind("http://localhost:3100/live")).toBe("absolute");
  });

  test("reads a root-relative path as relative", () => {
    expect(toLinkKind("/dispatches/tide-tables")).toBe("relative");
    expect(toLinkKind("/")).toBe("relative");
  });

  test("reads garbage as neither", () => {
    expect(toLinkKind("not a link")).toBeUndefined();
    expect(toLinkKind("example.com/pricing")).toBeUndefined();
    expect(toLinkKind("dispatches/tide-tables")).toBeUndefined();
  });

  test("refuses a protocol-relative path and a non-web scheme", () => {
    expect(toLinkKind("//example.com/x")).toBeUndefined();
    expect(toLinkKind("mailto:reader@example.com")).toBeUndefined();
    expect(toLinkKind("javascript:alert(1)")).toBeUndefined();
  });
});
