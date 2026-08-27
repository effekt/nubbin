import { describe, expect, it } from "vitest";
import { PLAN_FIELDS } from "./planFields.constants";
import { PLAN_PROMPTS } from "./planPrompts.constants";

describe("PLAN_PROMPTS", () => {
  it("asks about every field the table declares, in the same order, and about nothing else", () => {
    expect(Object.keys(PLAN_PROMPTS)).toEqual(Object.keys(PLAN_FIELDS));
  });

  it("labels every value of every field, in option order, and no value the field rejects", () => {
    for (const [field, options] of Object.entries(PLAN_FIELDS)) {
      const prompt = PLAN_PROMPTS[field as keyof typeof PLAN_PROMPTS];
      expect(Object.keys(prompt.options)).toEqual([...options]);
    }
  });

  it("asks a question a person could answer", () => {
    for (const prompt of Object.values(PLAN_PROMPTS)) {
      expect(prompt.question.endsWith("?")).toBe(true);
      expect(Object.values(prompt.options).every((label) => label.length > 0)).toBe(true);
    }
  });

  it("reads a plan's own answers back as the labels a customer chose", () => {
    expect(PLAN_PROMPTS.network.options.isolated).toBe("No — fully isolated");
    expect(PLAN_PROMPTS.delivery.options.nubbin).toBe("Nubbin CDN");
  });
});
