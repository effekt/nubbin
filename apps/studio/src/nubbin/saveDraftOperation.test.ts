import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runDraftSaveContract } from "@nubbin/studio/testing";
import { home } from "demo/fixtures/home";
import { draftRevision } from "./draftRevision";
import { saveDraftOperation } from "./saveDraftOperation";

runDraftSaveContract("reference filesystem host", () => {
  process.env.NUBBIN_STUDIO_DRAFTS = mkdtempSync(join(tmpdir(), "nubbin-drafts-contract-"));
  return {
    saveDraft: saveDraftOperation,
    route: "/",
    missingRoute: "/not-held",
    version: home,
    revision: draftRevision(home),
  };
});
