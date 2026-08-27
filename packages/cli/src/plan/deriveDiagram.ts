import type { Diagram } from "./diagram.types";
import { diagramEdges } from "./diagramEdges";
import { diagramNodes } from "./diagramNodes";
import type { Plan } from "./plan.types";

/**
 * The system picture a plan describes, as nodes and edges.
 *
 * A model rather than an SVG: the same plan has to draw as a branded diagram on a website and as
 * text in a terminal, and a picture that came out of here would carry a rule into both.
 */
export function deriveDiagram(plan: Plan): Diagram {
  return { nodes: diagramNodes(plan), edges: diagramEdges(plan) };
}
