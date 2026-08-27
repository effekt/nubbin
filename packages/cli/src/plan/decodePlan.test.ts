import { describe, expect, it } from "vitest";
import { decodePlan } from "./decodePlan";
import { defaultPlan } from "./defaultPlan";
import { encodePlan } from "./encodePlan";
import type { Plan } from "./plan.types";

const DEFAULT_CODE = "v1-aaaaaaaa000aaa";

describe("decodePlan", () => {
  it("reads the default plan back out of its code", () => {
    expect(decodePlan(DEFAULT_CODE)).toEqual(defaultPlan);
  });

  it("returns null for a revision it does not speak", () => {
    expect(decodePlan(`v2-${DEFAULT_CODE.slice("v1-".length)}`)).toBeNull();
    expect(decodePlan(DEFAULT_CODE.slice("v1-".length))).toBeNull();
  });

  it("returns null for a truncated or padded code", () => {
    expect(decodePlan(DEFAULT_CODE.slice(0, -1))).toBeNull();
    expect(decodePlan(`${DEFAULT_CODE}a`)).toBeNull();
    expect(decodePlan("v1-")).toBeNull();
    expect(decodePlan("")).toBeNull();
  });

  it("returns null for an out-of-range character in any position", () => {
    const body = DEFAULT_CODE.slice("v1-".length);
    for (let index = 0; index < body.length; index += 1) {
      const broken = `v1-${body.slice(0, index)}z${body.slice(index + 1)}`;
      expect(decodePlan(broken)).toBeNull();
    }
  });

  it("returns null for a position past the options a field declares", () => {
    // `components` has two options, so `c` addresses nothing.
    expect(decodePlan("v1-acaaaaaa000aaa")).toBeNull();
  });

  it("inverts encodePlan for a plan that answers everything differently", () => {
    const plan: Plan = {
      ...defaultPlan,
      framework: "other",
      components: "starter",
      studio: "nubbin",
      drafts: "nubbin",
      publishing: "nubbin",
      artifacts: "nubbin",
      delivery: "nubbin",
      consumption: "runtime",
      notifications: ["webhook", "workflow"],
      assets: "nubbin",
      operations: "nubbin",
      network: "private",
    };
    expect(decodePlan(encodePlan(plan))).toEqual(plan);
  });
});
