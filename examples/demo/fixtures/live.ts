import type { DocumentVersion } from "@nubbin/core";
import { liveBandDefaults } from "../src/blocks/liveBandDefaults";
import { siteFooterDefaults } from "../src/blocks/siteFooterDefaults";
import { updateFeedDefaults } from "../src/blocks/updateFeedDefaults";

/**
 * Holes and nothing else. Both fields on this page are resolved per request, so two loads a
 * second apart disagree — which is what a frozen artifact is not allowed to do, and what makes
 * this the page the end-to-end suite reads to prove resolution happened at all.
 */
export const live: DocumentVersion = {
  documentId: "live",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["band", "updates", "footer"] },
    },
    band: {
      id: "band",
      block: "LiveBand",
      props: { ...liveBandDefaults, label: "On the water now" },
    },
    updates: {
      id: "updates",
      block: "UpdateFeed",
      props: { ...updateFeedDefaults, heading: "Changed since the last edition" },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Live — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
