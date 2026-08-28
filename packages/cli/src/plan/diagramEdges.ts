import type { DiagramEdge } from "./diagram.types";
import type { Plan } from "./plan.types";

/** What the arrow into the application says about when the application reads an artifact. */
const WHEN = {
  build: "at build",
  "on-change": "on publish",
  runtime: "per request",
} as const;

/**
 * The arrows a plan draws: the publish path, then one per notification.
 *
 * The arrow that ends at the application is the one carrying the consumption label, whether it
 * leaves Nubbin's delivery or the customer's own artifact store.
 */
export function diagramEdges(plan: Plan): DiagramEdge[] {
  const isServedByNubbin = plan.delivery === "nubbin";
  const label = WHEN[plan.consumption];
  return [
    { from: "studio", to: "drafts" },
    { from: "drafts", to: "publish" },
    { from: "publish", to: "artifacts" },
    isServedByNubbin
      ? { from: "artifacts", to: "delivery" }
      : { from: "artifacts", to: "app", label },
    ...(isServedByNubbin ? [{ from: "delivery", to: "app", label }] : []),
    ...plan.notifications.map((notification) => ({
      from: "publish",
      to: "app",
      label: notification,
    })),
  ];
}
