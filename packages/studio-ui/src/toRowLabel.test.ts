import type { FieldNode } from "@nubbin/core";
import { expect, test } from "vitest";
import type { HintedFieldNode } from "./hintedField.types";
import { toRowLabel } from "./toRowLabel";

const statChildren: FieldNode[] = [
  { path: "stats[].value", kind: "string", optional: false, maxLength: 12 },
  { path: "stats[].label", kind: "string", optional: false, maxLength: 40 },
];

const galleryChildren: HintedFieldNode[] = [
  { path: "items[].url", kind: "string", optional: false, control: "link" },
  { path: "items[].alt", kind: "string", optional: false },
  { path: "items[].caption", kind: "string", optional: true, maxLength: 100 },
];

test("an object row is labelled by its first string field's value", () => {
  expect(toRowLabel({ value: "6", label: "springs mapped" }, statChildren)).toBe("6");
});

test("a scalar row is its own label", () => {
  expect(toRowLabel("Fast shipping", [])).toBe("Fast shipping");
});

test("an empty or missing label comes back undefined for the untitled state", () => {
  expect(toRowLabel({ value: "   ", label: "x" }, statChildren)).toBeUndefined();
  expect(toRowLabel({}, statChildren)).toBeUndefined();
  expect(toRowLabel("  ", [])).toBeUndefined();
  expect(toRowLabel(7, statChildren)).toBeUndefined();
});

test("a link-hinted field never labels a row — the first unhinted string does", () => {
  const row = {
    url: "/figures/harbour-arm.svg",
    alt: "A harbour arm at low tide",
    caption: "Low tide",
  };
  expect(toRowLabel(row, galleryChildren)).toBe("A harbour arm at low tide");
});

test("a row holding only its destination stays untitled", () => {
  expect(toRowLabel({ url: "/figures/harbour-arm.svg" }, galleryChildren)).toBeUndefined();
});

test("a row with no string field to speak through stays untitled", () => {
  const children: FieldNode[] = [{ path: "rows[].count", kind: "number", optional: false }];
  expect(toRowLabel({ count: 3 }, children)).toBeUndefined();
});
