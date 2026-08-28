import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import type { Plan } from "./plan.types";
import { stageSteps } from "./stageSteps";

describe("stageSteps", () => {
  it("gives one step per stage the customer runs something in", () => {
    expect(stageSteps(defaultPlan).map((step) => step.title)).toEqual([
      "Run Studio and save drafts",
      "Publish a route",
      "Store artifacts where your application can read them",
      "Render an artifact",
    ]);
  });

  it("drops a stage Nubbin runs entirely", () => {
    const plan: Plan = { ...defaultPlan, studio: "nubbin", drafts: "nubbin" };
    expect(stageSteps(plan).map((step) => step.title)).toEqual([
      "Publish a route",
      "Store artifacts where your application can read them",
      "Render an artifact",
    ]);
  });

  it("keeps a stage where the customer runs one of two boxes", () => {
    expect(stageSteps({ ...defaultPlan, studio: "nubbin" })[0]?.title).toBe(
      "Run Studio and save drafts",
    );
  });

  it("leaves only the application when Nubbin runs everything", () => {
    const plan: Plan = {
      ...defaultPlan,
      studio: "nubbin",
      drafts: "nubbin",
      publishing: "nubbin",
      artifacts: "nubbin",
      delivery: "nubbin",
      assets: "nubbin",
    };
    expect(stageSteps(plan)).toEqual([
      { title: "Render an artifact", docs: "reference/rendering/renderer" },
    ]);
  });
});
