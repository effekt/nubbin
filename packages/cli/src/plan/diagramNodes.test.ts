import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { diagramNodes } from "./diagramNodes";

describe("diagramNodes", () => {
  it("draws the publish path and the application, in order", () => {
    expect(diagramNodes(defaultPlan).map((node) => node.id)).toEqual([
      "studio",
      "drafts",
      "publish",
      "artifacts",
      "assets",
      "app",
    ]);
  });

  it("labels and owns each box from the field that answers for it", () => {
    const nodes = diagramNodes({ ...defaultPlan, studio: "nubbin" });
    expect(nodes[0]).toEqual({ id: "studio", label: "Studio", owner: "nubbin", stage: "author" });
    expect(nodes[1]).toEqual({
      id: "drafts",
      label: "Draft storage",
      owner: "you",
      stage: "author",
    });
  });

  it("draws delivery only when Nubbin serves", () => {
    expect(diagramNodes(defaultPlan).some((node) => node.id === "delivery")).toBe(false);
    expect(diagramNodes({ ...defaultPlan, delivery: "nubbin" })).toContainEqual({
      id: "delivery",
      label: "Delivery",
      owner: "nubbin",
      stage: "serve",
    });
  });

  it("always ends at an application the customer owns", () => {
    expect(diagramNodes({ ...defaultPlan, studio: "nubbin", delivery: "nubbin" }).at(-1)).toEqual({
      id: "app",
      label: "Application",
      owner: "you",
      stage: "consume",
    });
  });
});
