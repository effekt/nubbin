import { describe, expect, test } from "vitest";
import { assertValidRoute } from "./assertValidRoute";

describe("assertValidRoute", () => {
  test.each([
    ["/", "the root"],
    ["/pricing", "one segment"],
    ["/promotions/summer", "nested segments"],
    ["/blog/[slug]", "a param segment"],
    ["/docs/*", "a prefix route"],
    ["/a-b_c.d~e", "the punctuation a slug uses"],
  ])("accepts %o — %s", (route) => {
    expect(() => assertValidRoute(route)).not.toThrow();
  });

  test.each([
    ["", "an empty route addresses nothing"],
    ["pricing", "a route that does not start with a slash"],
    ["/pricing/", "a trailing slash, which would key two pointers to one page"],
    ["//pricing", "an empty segment"],
    ["/promotions//summer", "an empty segment between two real ones"],
    ["/pricing plans", "whitespace"],
    ["/pricing\n", "a control character"],
    ["/blog/[]", "a param naming nothing"],
    ["/blog/*/archive", "a star outside the final segment"],
    ["/blog/arch*ive", "a star inside a segment"],
  ])("rejects %o — %s", (route) => {
    expect(() => assertValidRoute(route)).toThrow();
  });

  test("names the route it rejected, so a caller publishing many knows which failed", () => {
    expect(() => assertValidRoute("/pricing/")).toThrow(/\/pricing\//);
  });
});
