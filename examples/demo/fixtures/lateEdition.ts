import type { DocumentVersion } from "@nubbin/core";
import { cardDefaults } from "../src/blocks/cardDefaults";
import { cardGridDefaults } from "../src/blocks/cardGridDefaults";
import { pageHeaderDefaults } from "../src/blocks/pageHeaderDefaults";
import { siteFooterDefaults } from "../src/blocks/siteFooterDefaults";

/**
 * Deliberately left unpublished by the publish script, so the build never sees this route and
 * the end-to-end suite can prove a page reaches a running server without one.
 */
export const lateEdition: DocumentVersion = {
  documentId: "late-edition",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["header", "grid", "footer"] },
    },
    header: {
      id: "header",
      block: "PageHeader",
      props: {
        ...pageHeaderDefaults,
        eyebrow: "Late edition",
        headline: "Filed after the boats are in",
        body: "What arrived too late for the morning read.",
      },
    },
    grid: {
      id: "grid",
      block: "CardGrid",
      props: { ...cardGridDefaults, heading: undefined, columns: "two" },
      slots: { cards: ["card-swell"] },
    },
    "card-swell": {
      id: "card-swell",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Swell running before a wind that has not arrived",
        summary: "Two metres by morning, on a flat calm evening. It is coming from somewhere else.",
        meta: "Weather",
        badge: "new",
      },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Late edition — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
