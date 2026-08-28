import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { planShapeIssues } from "./planShapeIssues";

describe("planShapeIssues", () => {
  it("finds nothing wrong with a plan", () => {
    expect(planShapeIssues(defaultPlan)).toEqual([]);
  });

  it("refuses a value that is not an object", () => {
    expect(planShapeIssues("v1-aaaaaaaa000aaa")).toEqual([
      { message: "Expected an object carrying every plan field." },
    ]);
    expect(planShapeIssues(null)).toHaveLength(1);
  });

  it("names the field that is wrong, and only that one", () => {
    expect(planShapeIssues({ ...defaultPlan, network: "airgapped" })).toEqual([
      { message: "Expected one of: public, private, isolated.", path: ["network"] },
    ]);
  });

  it("names every missing field", () => {
    expect(planShapeIssues({}).map((issue) => issue.path?.[0])).toEqual([
      "framework",
      "components",
      "studio",
      "drafts",
      "publishing",
      "artifacts",
      "delivery",
      "consumption",
      "notifications",
      "assets",
      "operations",
      "network",
    ]);
  });
});
