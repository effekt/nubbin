import { describe, expect, test } from "vitest";
import { holeFetchOptions } from "./holeFetchOptions";

describe("holeFetchOptions", () => {
  test("a hole carries its interval into Next's data cache", () => {
    expect(holeFetchOptions({ revalidate: 60 })).toEqual({ next: { revalidate: 60 } });
  });

  test("a zero interval is passed through rather than treated as absent", () => {
    expect(holeFetchOptions({ revalidate: 0 })).toEqual({ next: { revalidate: 0 } });
  });
});
