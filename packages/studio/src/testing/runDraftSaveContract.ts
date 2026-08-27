import { describe, expect, test } from "vitest";
import { assertSavedDraft } from "./assertSavedDraft";
import type { MakeDraftSaveContractHarness } from "./draftSaveContract.types";
import { versionWithTitle } from "./versionWithTitle";

/**
 * Runs the compare-and-save guarantees every Studio draft host must preserve.
 *
 * Call this at module scope in a Vitest file. The factory must return isolated state for each
 * case; the suite intentionally knows nothing about its storage or transport.
 */
export function runDraftSaveContract(
  name: string,
  makeHarness: MakeDraftSaveContractHarness,
): void {
  describe(`Studio draft-save contract: ${name}`, () => {
    test("a current revision saves and the returned revision chains", async () => {
      const harness = await makeHarness();
      const firstVersion = versionWithTitle(harness.version, "First");
      const first = await harness.saveDraft({
        route: harness.route,
        version: firstVersion,
        expectedRevision: harness.revision,
      });
      assertSavedDraft(first);
      const second = await harness.saveDraft({
        route: harness.route,
        version: versionWithTitle(firstVersion, "Second"),
        expectedRevision: first.revision,
      });
      assertSavedDraft(second);
    });

    test("a stale revision returns the current draft without accepting the write", async () => {
      const harness = await makeHarness();
      const remote = versionWithTitle(harness.version, "Remote");
      const first = await harness.saveDraft({
        route: harness.route,
        version: remote,
        expectedRevision: harness.revision,
      });
      assertSavedDraft(first);
      const stale = await harness.saveDraft({
        route: harness.route,
        version: versionWithTitle(harness.version, "Local"),
        expectedRevision: harness.revision,
      });
      expect(stale).toEqual({ status: "conflict", revision: first.revision, version: remote });
    });

    test("a route the host does not hold is an explicit missing outcome", async () => {
      const harness = await makeHarness();
      expect(
        await harness.saveDraft({
          route: harness.missingRoute,
          version: harness.version,
          expectedRevision: harness.revision,
        }),
      ).toEqual({ status: "missing" });
    });

    test("two writers on one revision produce one save and one conflict", async () => {
      const harness = await makeHarness();
      const outcomes = await Promise.all(
        ["Left", "Right"].map((title) =>
          harness.saveDraft({
            route: harness.route,
            version: versionWithTitle(harness.version, title),
            expectedRevision: harness.revision,
          }),
        ),
      );
      expect(outcomes.map((outcome) => outcome.status).sort()).toEqual(["conflict", "saved"]);
      const accepted = outcomes.find((outcome) => outcome.status === "saved");
      const refused = outcomes.find((outcome) => outcome.status === "conflict");
      expect(refused?.revision).toBe(accepted?.revision);
    });
  });
}
