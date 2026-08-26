import { expect, test } from "vitest";
import { fieldIdMatchesPath } from "./fieldIdMatchesPath";

test("a top-level control matches whatever field type Puck rendered", () => {
  expect(fieldIdMatchesPath("n7_custom_headline", "n7", "headline")).toBe(true);
  expect(fieldIdMatchesPath("n7_text_headline", "n7", "headline")).toBe(true);
});

test("a nested control matches its dotted path with dots as underscores", () => {
  expect(fieldIdMatchesPath("n7_custom_stats_0_label", "n7", "stats.0.label")).toBe(true);
  expect(fieldIdMatchesPath("n7_custom_stats_0_label", "n7", "stats.0")).toBe(false);
});

test("a rich-text span's controls match the compiler's path into the document", () => {
  expect(fieldIdMatchesPath("n7_custom_body_0_spans_1_text", "n7", "body.0.spans.1.text")).toBe(
    true,
  );
  expect(fieldIdMatchesPath("n7_custom_body_0_spans_1", "n7", "body.0.spans.1")).toBe(true);
  expect(fieldIdMatchesPath("n7_custom_body_0_spans_1_text", "n7", "body.0.spans.1")).toBe(false);
});

test("another node's control, a bare name and a missing type segment all refuse", () => {
  expect(fieldIdMatchesPath("n8_custom_headline", "n7", "headline")).toBe(false);
  expect(fieldIdMatchesPath("headline", "n7", "headline")).toBe(false);
  expect(fieldIdMatchesPath("n7_headline", "n7", "headline")).toBe(false);
});
