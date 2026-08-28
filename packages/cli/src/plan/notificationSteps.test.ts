import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { notificationSteps } from "./notificationSteps";
import type { Plan } from "./plan.types";

describe("notificationSteps", () => {
  it("gives nothing to a plan that reacts to nothing", () => {
    expect(notificationSteps(defaultPlan)).toEqual([]);
  });

  it("gives one step per notification, in the order answered", () => {
    const plan: Plan = { ...defaultPlan, notifications: ["workflow", "webhook"] };
    expect(notificationSteps(plan)).toEqual([
      { title: "Run a workflow when a route publishes", docs: "reference/publishing/cli" },
      { title: "Receive a webhook when a route publishes", docs: "reference/publishing/cli" },
    ]);
  });
});
