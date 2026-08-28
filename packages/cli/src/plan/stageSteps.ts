import { deriveDiagram } from "./deriveDiagram";
import type { DiagramStage } from "./diagram.types";
import type { Plan } from "./plan.types";
import type { Step } from "./step.types";

const BY_STAGE = {
  author: { title: "Run Studio and save drafts", docs: "reference/editing/studio" },
  publish: {
    title: "Publish a route",
    command: "npx nubbin publish /pricing",
    docs: "reference/publishing/cli",
  },
  store: {
    title: "Store artifacts where your application can read them",
    docs: "reference/publishing/artifacts",
  },
  serve: { title: "Serve artifacts to your application", docs: "reference/publishing/artifacts" },
  consume: { title: "Render an artifact", docs: "reference/rendering/renderer" },
} as const satisfies Record<DiagramStage, Step>;

/**
 * One step per stage the customer runs something in, in diagram order.
 *
 * Per stage rather than per node: a customer running Studio and holding drafts has one thing to
 * set up, and two steps that both say "authoring" read as busywork.
 */
export function stageSteps(plan: Plan): Step[] {
  const owned = deriveDiagram(plan).nodes.filter((node) => node.owner === "you");
  return [...new Set(owned.map((node) => node.stage))].map((stage) => ({ ...BY_STAGE[stage] }));
}
