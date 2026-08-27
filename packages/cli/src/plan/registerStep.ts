import type { Plan } from "./plan.types";
import type { Step } from "./step.types";

const TITLES = {
  existing: "Register the components authors may use",
  starter: "Start from the demo blocks",
} as const;

/**
 * The step that turns components into a palette, which reads differently for a customer who has
 * a design system already and one who does not.
 */
export function registerStep(plan: Plan): Step {
  return { title: TITLES[plan.components], docs: "reference/authoring/blocks" };
}
