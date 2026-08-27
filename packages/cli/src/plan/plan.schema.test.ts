import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { planSchema } from "./plan.schema";

const validate = planSchema["~standard"].validate;

describe("planSchema", () => {
  it("declares itself as a Standard Schema", () => {
    expect(planSchema["~standard"].version).toBe(1);
    expect(planSchema["~standard"].vendor).toBe("nubbin");
  });

  it("returns the value for a plan", () => {
    expect(validate(defaultPlan)).toEqual({ value: defaultPlan });
  });

  it("returns issues for a plan with a value no field declares", () => {
    const result = validate({ ...defaultPlan, consumption: "hourly" });
    expect(result).toEqual({
      issues: [{ message: "Expected one of: build, on-change, runtime.", path: ["consumption"] }],
    });
  });

  it("refuses rather than throws on a value of the wrong shape", () => {
    expect(() => validate(42)).not.toThrow();
    expect(validate(42)).toHaveProperty("issues");
  });
});
