import { describe, expect, test } from "vitest";
import { hostedPublishField } from "./hostedPublishField";
import { defaultPlan } from "./plan/defaultPlan";

describe("hostedPublishField", () => {
  test("a publish path the customer runs end to end names no field", () => {
    expect(hostedPublishField(defaultPlan)).toBeNull();
  });

  test("a Nubbin-run service outside the publish path names no field either", () => {
    expect(hostedPublishField({ ...defaultPlan, studio: "nubbin", delivery: "nubbin" })).toBeNull();
  });

  test.each([
    ["drafts", { drafts: "nubbin", publishing: "nubbin", artifacts: "nubbin" }],
    ["publishing", { publishing: "nubbin", artifacts: "nubbin" }],
    ["artifacts", { artifacts: "nubbin" }],
  ] as const)("the first Nubbin-run stage in field order decides: %s", (field, hosted) => {
    expect(hostedPublishField({ ...defaultPlan, ...hosted })).toBe(field);
  });
});
