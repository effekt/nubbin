import { describe, expect, test } from "vitest";
import { formatPlan } from "./formatPlan";
import { decodePlan } from "./plan/decodePlan";
import { defaultPlan } from "./plan/defaultPlan";
import { describePlan } from "./plan/describePlan";

const hosted = decodePlan("v1-aaaaabaa000aaa");

describe("formatPlan", () => {
  test("the description first, as one line", () => {
    expect(formatPlan(defaultPlan)[0]).toBe(describePlan(defaultPlan));
    expect(formatPlan(defaultPlan)[0]).not.toContain("\n");
  });

  test("then the ownership split, each party on its own line", () => {
    expect(formatPlan(defaultPlan).slice(1, 3)).toEqual([
      "You run: Application, Components, Studio, Draft storage, Publishing, Artifact store, Delivery, Assets, Operations",
      "Nubbin runs: nothing",
    ]);
    expect(formatPlan(hosted ?? defaultPlan)[2]).toBe("Nubbin runs: Artifact store");
  });

  test("then the steps, numbered from one, each command indented beneath its title", () => {
    const steps = formatPlan(defaultPlan).slice(3);
    expect(steps[0]).toBe("1. Install the packages");
    expect(steps[1]).toMatch(/^ {3}\$ npm install @nubbin\/core /);
    expect(steps.filter((line) => /^\d+\. /.test(line))).toHaveLength(6);
    expect(steps.at(-1)).toBe("6. Render an artifact");
  });

  test("prints no outcome and no code: those belong to the command around it", () => {
    const text = formatPlan(defaultPlan).join("\n");
    expect(text).not.toContain("wrote");
    expect(text).not.toContain("Plan:");
  });
});
