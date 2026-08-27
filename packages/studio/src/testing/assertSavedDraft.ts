import { expect } from "vitest";
import type { DraftSaveOutcome } from "../draftSave.types";

/** Narrows one host outcome after recording the contract assertion. */
export function assertSavedDraft(
  outcome: DraftSaveOutcome,
): asserts outcome is Extract<DraftSaveOutcome, { status: "saved" }> {
  expect(outcome.status).toBe("saved");
  if (outcome.status !== "saved") throw new Error(`expected saved, received ${outcome.status}`);
}
