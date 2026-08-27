import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { planSchema } from "./plan.schema";
import { planIssues } from "./planIssues";

describe("defaultPlan", () => {
  it("validates", () => {
    expect(planSchema["~standard"].validate(defaultPlan)).toEqual({ value: defaultPlan });
  });

  it("raises no consistency issue", () => {
    expect(planIssues(defaultPlan)).toEqual([]);
  });

  it("owns every service itself", () => {
    expect(defaultPlan.studio).toBe("self");
    expect(defaultPlan.drafts).toBe("self");
    expect(defaultPlan.publishing).toBe("self");
    expect(defaultPlan.artifacts).toBe("self");
    expect(defaultPlan.delivery).toBe("self");
    expect(defaultPlan.assets).toBe("self");
    expect(defaultPlan.operations).toBe("self");
  });
});
