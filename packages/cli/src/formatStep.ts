import type { Step } from "./plan/step.types";

/**
 * One step as a numbered title, with its command indented beneath when it has one. The `docs`
 * path is left out: it is a path on a documentation site, and the terminal cannot name which
 * origin that site is served from, so printing it would print half a link.
 */
export function formatStep(step: Step, position: number): string[] {
  const command = step.command === undefined ? [] : [`   $ ${step.command}`];
  return [`${position}. ${step.title}`, ...command];
}
