import { describe, expect, it } from "vitest";
import { defaultPlan } from "./defaultPlan";
import { deriveDiagram } from "./deriveDiagram";
import { diagramEdges } from "./diagramEdges";
import { diagramNodes } from "./diagramNodes";
import type { Plan } from "./plan.types";

describe("deriveDiagram", () => {
  it("is the nodes and the edges together", () => {
    const plan: Plan = { ...defaultPlan, delivery: "nubbin", artifacts: "nubbin" };
    expect(deriveDiagram(plan)).toEqual({ nodes: diagramNodes(plan), edges: diagramEdges(plan) });
  });

  it("names every edge endpoint as a node it drew", () => {
    const plan: Plan = { ...defaultPlan, notifications: ["deploy"] };
    const { nodes, edges } = deriveDiagram(plan);
    const ids = new Set(nodes.map((node) => node.id));
    for (const edge of edges) {
      expect(ids.has(edge.from)).toBe(true);
      expect(ids.has(edge.to)).toBe(true);
    }
  });
});
