import { describe, expect, test } from "vitest";
import { assertDataHintAddressable } from "./assertDataHintAddressable";

describe("assertDataHintAddressable", () => {
  test("rejects a data hint on an array-member path, naming the block and the path", () => {
    expect(() =>
      assertDataHintAddressable("Hero", { "items[].heading": { data: { revalidate: 60 } } }),
    ).toThrow(/Hero.*items\[\]\.heading/s);
  });

  test("rejects a revalidate data hint the same way — the kind of data hint is irrelevant", () => {
    expect(() =>
      assertDataHintAddressable("Hero", { "items[].heading": { data: { revalidate: 5 } } }),
    ).toThrow(/items\[\]\.heading/);
  });

  test("accepts label and control hints on an array-member path", () => {
    expect(() =>
      assertDataHintAddressable("Hero", {
        "items[].heading": {},
      }),
    ).not.toThrow();
  });

  test("accepts a data hint on a path without an array member", () => {
    expect(() =>
      assertDataHintAddressable("Hero", { items: { data: { revalidate: 60 } } }),
    ).not.toThrow();
  });

  test("accepts a data hint on a nested path — one object field has one target", () => {
    expect(() =>
      assertDataHintAddressable("Hero", { "cta.label": { data: { revalidate: 60 } } }),
    ).not.toThrow();
  });

  test("rejects a data hint on an ancestor of another data hint, naming both paths", () => {
    expect(() =>
      assertDataHintAddressable("Hero", {
        cta: { data: { revalidate: 60 } },
        "cta.label": { data: { revalidate: 60 } },
      }),
    ).toThrow(/Hero.*"cta".*"cta\.label"/s);
  });

  test("rejects the overlap in either declaration order", () => {
    expect(() =>
      assertDataHintAddressable("Hero", {
        "cta.label": { data: { revalidate: 5 } },
        cta: { data: { revalidate: 60 } },
      }),
    ).toThrow(/overlap/i);
  });

  test("accepts sibling data hints that share a prefix but nest in neither direction", () => {
    expect(() =>
      assertDataHintAddressable("Hero", {
        "cta.label": { data: { revalidate: 60 } },
        "cta.href": { data: { revalidate: 60 } },
        ctaLabel: { data: { revalidate: 60 } },
      }),
    ).not.toThrow();
  });

  test("ignores a non-data hint on an ancestor of a data hint", () => {
    expect(() =>
      assertDataHintAddressable("Hero", {
        cta: {},
        "cta.label": { data: { revalidate: 60 } },
      }),
    ).not.toThrow();
  });
});
