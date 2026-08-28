import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { isolatedNetworkIssues } from "./isolatedNetworkIssues";
import type { Plan } from "./plan.types";

const MESSAGE = "An isolated network reaches no Nubbin service.";

describe("isolatedNetworkIssues", () => {
  it("says nothing about a public network", () => {
    expect(isolatedNetworkIssues({ ...defaultPlan, studio: "nubbin" })).toEqual([]);
  });

  it("says nothing about an isolated network running everything itself", () => {
    expect(isolatedNetworkIssues({ ...defaultPlan, network: "isolated" })).toEqual([]);
  });

  it("names the one hosted service on an isolated network", () => {
    expect(
      isolatedNetworkIssues({ ...defaultPlan, network: "isolated", drafts: "nubbin" }),
    ).toEqual([{ field: "drafts", message: MESSAGE }]);
  });

  it("names every hosted service, so a customer sees each answer to undo", () => {
    const plan: Plan = {
      ...defaultPlan,
      network: "isolated",
      studio: "nubbin",
      artifacts: "nubbin",
      delivery: "nubbin",
    };
    expect(isolatedNetworkIssues(plan).map((issue) => issue.field)).toEqual([
      "studio",
      "artifacts",
      "delivery",
    ]);
  });
});
