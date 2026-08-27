import { installStep } from "./installStep";
import { notificationSteps } from "./notificationSteps";
import type { Plan } from "./plan.types";
import { registerStep } from "./registerStep";
import { stageSteps } from "./stageSteps";
import type { Step } from "./step.types";

/**
 * Past this many steps a getting-started list stops being read, so the tail is cut rather than
 * shown.
 */
const MAX_STEPS = 8;

const FIRST = 0;

/**
 * What a customer does next, in order: install, register components, stand up each stage they own,
 * then wire each notification.
 *
 * Capped rather than complete: a plan owning every stage and taking every notification produces a
 * list longer than anyone finishes, and the steps past the cap are the ones a reader reaches with
 * the product already running.
 */
export function deriveSteps(plan: Plan): Step[] {
  return [
    installStep(plan),
    registerStep(plan),
    ...stageSteps(plan),
    ...notificationSteps(plan),
  ].slice(FIRST, MAX_STEPS);
}
