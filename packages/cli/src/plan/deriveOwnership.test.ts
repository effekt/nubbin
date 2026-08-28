import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { deriveOwnership } from "./deriveOwnership";
import type { Plan } from "./plan.types";

describe("deriveOwnership", () => {
  it("gives a self-hosted plan everything", () => {
    expect(deriveOwnership(defaultPlan)).toEqual({
      you: [
        "Application",
        "Components",
        "Studio",
        "Draft storage",
        "Publishing",
        "Artifact store",
        "Delivery",
        "Assets",
        "Operations",
      ],
      nubbin: [],
    });
  });

  it("moves a label by the field that answers for it", () => {
    const plan: Plan = { ...defaultPlan, studio: "nubbin", drafts: "nubbin" };
    expect(deriveOwnership(plan)).toEqual({
      you: [
        "Application",
        "Components",
        "Publishing",
        "Artifact store",
        "Delivery",
        "Assets",
        "Operations",
      ],
      nubbin: ["Studio", "Draft storage"],
    });
  });

  it("keeps the application and the components whatever else is hosted", () => {
    const plan: Plan = {
      ...defaultPlan,
      studio: "nubbin",
      drafts: "nubbin",
      publishing: "nubbin",
      artifacts: "nubbin",
      delivery: "nubbin",
      assets: "nubbin",
      operations: "nubbin",
    };
    expect(deriveOwnership(plan).you).toEqual(["Application", "Components"]);
  });
});
