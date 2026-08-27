import type { DiagramNode, DiagramStage } from "./diagram.types";
import type { Plan } from "./plan.types";
import { PLAN_LABELS } from "./planLabels.constants";

const SOURCES = [
  { id: "studio", field: "studio", label: PLAN_LABELS.studio, stage: "author" },
  { id: "drafts", field: "drafts", label: PLAN_LABELS.drafts, stage: "author" },
  { id: "publish", field: "publishing", label: PLAN_LABELS.publishing, stage: "publish" },
  { id: "artifacts", field: "artifacts", label: PLAN_LABELS.artifacts, stage: "store" },
  { id: "delivery", field: "delivery", label: PLAN_LABELS.delivery, stage: "serve" },
  { id: "assets", field: "assets", label: PLAN_LABELS.assets, stage: "store" },
] as const satisfies readonly {
  id: string;
  field: keyof Plan;
  label: string;
  stage: DiagramStage;
}[];

const APPLICATION: DiagramNode = {
  id: "app",
  label: PLAN_LABELS.application,
  owner: "you",
  stage: "consume",
};

/**
 * The boxes a plan puts on the page, in publish-path order, with the application last.
 *
 * `delivery` is the one box a plan can leave out: serving artifacts yourself is the application
 * doing it, so a separate box would draw a service nobody runs.
 */
export function diagramNodes(plan: Plan): DiagramNode[] {
  const hosted = SOURCES.filter(
    (source) => source.id !== "delivery" || plan.delivery === "nubbin",
  ).map((source) => ({
    id: source.id,
    label: source.label,
    owner: plan[source.field] === "nubbin" ? ("nubbin" as const) : ("you" as const),
    stage: source.stage,
  }));
  return [...hosted, APPLICATION];
}
