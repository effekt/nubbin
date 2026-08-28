import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { registerStep } from "./registerStep";

describe("registerStep", () => {
  it("registers the components a customer already has", () => {
    expect(registerStep(defaultPlan)).toEqual({
      title: "Register the components authors may use",
      docs: "reference/authoring/blocks",
    });
  });

  it("starts from the demo blocks when there are none", () => {
    expect(registerStep({ ...defaultPlan, components: "starter" }).title).toBe(
      "Start from the demo blocks",
    );
  });
});
