import { describe, expect, test } from "vitest";
import { endpointFor } from "./endpointFor";
import { UsageError } from "./UsageError";

describe("endpointFor", () => {
  test("posts to the application's handler under the origin", () => {
    expect(endpointFor("http://localhost:3000", "publish").href).toBe(
      "http://localhost:3000/api/nubbin/publish",
    );
  });

  test("keeps a base path rather than resolving to the host's root", () => {
    expect(endpointFor("http://example.com/marketing", "publish").href).toBe(
      "http://example.com/marketing/api/nubbin/publish",
    );
  });

  test("does not double a trailing slash", () => {
    expect(endpointFor("http://example.com/marketing/", "unpublish").href).toBe(
      "http://example.com/marketing/api/nubbin/unpublish",
    );
  });

  test("refuses an origin with no scheme as usage, naming what is wrong", () => {
    expect(() => endpointFor("localhost:3000", "publish")).toThrow(UsageError);
    expect(() => endpointFor("localhost:3000", "publish")).toThrow(/needs a scheme/);
  });
});
