import { describe, expect, it } from "vitest";
import { decodePlan } from "./decodePlan";
import { defaultPlan } from "./defaultPlan";
import { encodePlan } from "./encodePlan";
import type { Plan } from "./plan.types";
import { PLAN_FIELDS } from "./planFields.constants";

const NOTIFICATION_SETS: Plan["notifications"][] = [
  [],
  ["webhook"],
  ["deploy"],
  ["workflow"],
  ["webhook", "deploy"],
  ["webhook", "deploy", "workflow"],
];

/** The default plan varied one field at a time, across every value every field declares. */
const everyPlan: Plan[] = [
  ...PLAN_FIELDS.framework.map((framework) => ({ ...defaultPlan, framework })),
  ...PLAN_FIELDS.components.map((components) => ({ ...defaultPlan, components })),
  ...PLAN_FIELDS.studio.map((studio) => ({ ...defaultPlan, studio })),
  ...PLAN_FIELDS.drafts.map((drafts) => ({ ...defaultPlan, drafts })),
  ...PLAN_FIELDS.publishing.map((publishing) => ({ ...defaultPlan, publishing })),
  ...PLAN_FIELDS.artifacts.map((artifacts) => ({ ...defaultPlan, artifacts })),
  ...PLAN_FIELDS.delivery.map((delivery) => ({ ...defaultPlan, delivery })),
  ...PLAN_FIELDS.consumption.map((consumption) => ({ ...defaultPlan, consumption })),
  ...NOTIFICATION_SETS.map((notifications) => ({ ...defaultPlan, notifications })),
  ...PLAN_FIELDS.assets.map((assets) => ({ ...defaultPlan, assets })),
  ...PLAN_FIELDS.operations.map((operations) => ({ ...defaultPlan, operations })),
  ...PLAN_FIELDS.network.map((network) => ({ ...defaultPlan, network })),
];

describe("encodePlan", () => {
  it("writes the default plan as the all-first-option code", () => {
    expect(encodePlan(defaultPlan)).toBe("v1-aaaaaaaa000aaa");
  });

  it("writes one character per enum field and one per notification option", () => {
    expect(encodePlan({ ...defaultPlan, network: "isolated" })).toBe("v1-aaaaaaaa000aac");
    expect(encodePlan({ ...defaultPlan, notifications: ["deploy"] })).toBe("v1-aaaaaaaa010aaa");
    expect(encodePlan({ ...defaultPlan, framework: "other", studio: "nubbin" })).toBe(
      "v1-cabaaaaa000aaa",
    );
  });

  it("orders notification flags by option, not by the order they were answered in", () => {
    expect(encodePlan({ ...defaultPlan, notifications: ["workflow", "webhook"] })).toBe(
      "v1-aaaaaaaa101aaa",
    );
  });

  it("round-trips every value of every field", () => {
    expect(everyPlan.length).toBeGreaterThan(20);
    for (const plan of everyPlan) {
      expect(decodePlan(encodePlan(plan))).toEqual(plan);
    }
  });
});
