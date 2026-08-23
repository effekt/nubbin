import type { SlotConstraint } from "./block.types";
import { NubbinIssueCode } from "./NubbinIssueCode";
import { refuse } from "./refuse";

/** A slot whose min exceeds its max is one no composition could satisfy. */
export function assertSlotBounds(name: string, slots: Record<string, SlotConstraint>): void {
  for (const [slot, { min, max }] of Object.entries(slots)) {
    if (min !== undefined && max !== undefined && min > max) {
      refuse(NubbinIssueCode.SlotBounds, `min ${min} is above max ${max}`, `${name} slots.${slot}`);
    }
  }
}
