import type { Plan } from "./plan.types";
import type { Step } from "./step.types";

const BY_NOTIFICATION = {
  webhook: { title: "Receive a webhook when a route publishes", docs: "reference/publishing/cli" },
  deploy: { title: "Trigger a deploy when a route publishes", docs: "reference/publishing/cli" },
  workflow: { title: "Run a workflow when a route publishes", docs: "reference/publishing/cli" },
} as const;

/** One step per way the plan reacts to a publish, in the order the fields declare them. */
export function notificationSteps(plan: Plan): Step[] {
  return plan.notifications.map((notification) => ({ ...BY_NOTIFICATION[notification] }));
}
