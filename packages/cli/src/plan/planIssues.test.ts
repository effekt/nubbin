import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import type { Plan } from "./plan.types";
import { planIssues } from "./planIssues";

describe("planIssues", () => {
  it("stays silent on the default plan", () => {
    expect(planIssues(defaultPlan)).toEqual([]);
  });

  it("refuses Nubbin delivery of artifacts Nubbin does not store", () => {
    expect(planIssues({ ...defaultPlan, delivery: "nubbin" })).toEqual([
      { field: "artifacts", message: "Nubbin can only serve artifacts it stores." },
    ]);
  });

  it("accepts Nubbin delivery of artifacts Nubbin stores", () => {
    expect(planIssues({ ...defaultPlan, delivery: "nubbin", artifacts: "nubbin" })).toEqual([]);
  });

  it("refuses reacting to a change with nothing to react to", () => {
    expect(planIssues({ ...defaultPlan, consumption: "on-change" })).toEqual([
      {
        field: "notifications",
        message: "Reacting to a change needs a notification to react to.",
      },
    ]);
  });

  it("accepts reacting to a change that arrives as a notification", () => {
    const plan: Plan = { ...defaultPlan, consumption: "on-change", notifications: ["deploy"] };
    expect(planIssues(plan)).toEqual([]);
  });

  it("refuses a Nubbin service on an isolated network", () => {
    expect(planIssues({ ...defaultPlan, network: "isolated", assets: "nubbin" })).toEqual([
      { field: "assets", message: "An isolated network reaches no Nubbin service." },
    ]);
  });

  it("accepts Nubbin operating infrastructure the customer runs", () => {
    expect(planIssues({ ...defaultPlan, operations: "nubbin" })).toEqual([]);
    expect(planIssues({ ...defaultPlan, operations: "nubbin", network: "isolated" })).toEqual([]);
  });

  it("reports every rule a plan breaks at once", () => {
    const plan: Plan = {
      ...defaultPlan,
      delivery: "nubbin",
      consumption: "on-change",
      network: "isolated",
    };
    expect(planIssues(plan).map((issue) => issue.field)).toEqual([
      "artifacts",
      "notifications",
      "delivery",
    ]);
  });
});
