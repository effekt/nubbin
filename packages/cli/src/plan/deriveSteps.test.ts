import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { deriveSteps } from "./deriveSteps";
import type { Plan } from "./plan.types";

describe("deriveSteps", () => {
  it("installs, registers, then walks the stages the customer owns", () => {
    expect(deriveSteps(defaultPlan).map((step) => step.title)).toEqual([
      "Install the packages",
      "Register the components authors may use",
      "Run Studio and save drafts",
      "Publish a route",
      "Store artifacts where your application can read them",
      "Render an artifact",
    ]);
  });

  it("puts the notifications last", () => {
    const plan: Plan = { ...defaultPlan, notifications: ["deploy"] };
    expect(deriveSteps(plan).at(-1)?.title).toBe("Trigger a deploy when a route publishes");
  });

  it("stops at eight, however much a plan asks for", () => {
    const plan: Plan = {
      ...defaultPlan,
      notifications: ["webhook", "deploy", "workflow"],
      consumption: "on-change",
    };
    expect(deriveSteps(plan)).toHaveLength(8);
  });

  it("carries the command on the step that has one", () => {
    const install = deriveSteps(defaultPlan)[0];
    expect(install?.command).toContain("npm install @nubbin/core");
    expect(deriveSteps(defaultPlan)[3]?.command).toBe("npx nubbin publish /pricing");
  });
});
