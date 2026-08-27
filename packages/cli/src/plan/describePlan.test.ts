import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { describePlan } from "./describePlan";
import type { Plan } from "./plan.types";

describe("describePlan", () => {
  it("describes the default plan in two sentences", () => {
    expect(describePlan(defaultPlan)).toBe(
      "You run Studio and keep drafts on your own infrastructure. You store and serve published artifacts yourself, and your application reads them at build time.",
    );
  });

  it("names Nubbin where Nubbin runs the thing", () => {
    const plan: Plan = { ...defaultPlan, studio: "nubbin", drafts: "nubbin" };
    expect(describePlan(plan)).toBe(
      "Nubbin runs Studio and keeps your drafts. You store and serve published artifacts yourself, and your application reads them at build time.",
    );
  });

  it("keeps both subjects when authoring is split", () => {
    expect(describePlan({ ...defaultPlan, studio: "nubbin" })).toContain(
      "Nubbin runs Studio and you keep drafts on your own infrastructure.",
    );
    expect(describePlan({ ...defaultPlan, drafts: "nubbin" })).toContain(
      "You run Studio and Nubbin keeps your drafts.",
    );
  });

  it("names where artifacts live, who serves them, and when they are read", () => {
    const plan: Plan = {
      ...defaultPlan,
      artifacts: "nubbin",
      delivery: "nubbin",
      consumption: "runtime",
    };
    expect(describePlan(plan)).toBe(
      "You run Studio and keep drafts on your own infrastructure. Nubbin stores and serves published artifacts, and your application reads them on every request.",
    );
  });

  it("says when the application reads for each answer", () => {
    expect(describePlan({ ...defaultPlan, consumption: "on-change" })).toContain(
      "reads them when they change.",
    );
  });
});
