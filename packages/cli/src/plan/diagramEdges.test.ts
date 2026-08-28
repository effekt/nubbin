import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { diagramEdges } from "./diagramEdges";
import type { Plan } from "./plan.types";

describe("diagramEdges", () => {
  it("runs the publish path into the application", () => {
    expect(diagramEdges(defaultPlan)).toEqual([
      { from: "studio", to: "drafts" },
      { from: "drafts", to: "publish" },
      { from: "publish", to: "artifacts" },
      { from: "artifacts", to: "app", label: "at build" },
    ]);
  });

  it("routes through delivery when Nubbin serves", () => {
    expect(diagramEdges({ ...defaultPlan, delivery: "nubbin", artifacts: "nubbin" })).toEqual([
      { from: "studio", to: "drafts" },
      { from: "drafts", to: "publish" },
      { from: "publish", to: "artifacts" },
      { from: "artifacts", to: "delivery" },
      { from: "delivery", to: "app", label: "at build" },
    ]);
  });

  it("labels the arrow into the application with when the application reads", () => {
    const labelOf = (consumption: "build" | "on-change" | "runtime") =>
      diagramEdges({ ...defaultPlan, consumption }).at(-1)?.label;
    expect(labelOf("build")).toBe("at build");
    expect(labelOf("on-change")).toBe("on publish");
    expect(labelOf("runtime")).toBe("per request");
  });

  it("adds one arrow per notification, named for it", () => {
    const plan: Plan = { ...defaultPlan, notifications: ["webhook", "workflow"] };
    expect(diagramEdges(plan).slice(-2)).toEqual([
      { from: "publish", to: "app", label: "webhook" },
      { from: "publish", to: "app", label: "workflow" },
    ]);
  });
});
