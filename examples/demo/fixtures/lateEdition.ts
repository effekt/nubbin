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
      slots: { cards: ["card-swell", "card-glass", "card-lamp", "card-count"] },
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
    "card-glass": {
      id: "card-glass",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "The glass has been falling since four",
        summary:
          "Nine millibars in six hours, which is the sort of drop that arrives with weather.",
        meta: "Weather",
        badge: "new",
      },
    },
    "card-lamp": {
      id: "card-lamp",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "The east arm lamp is out again",
        summary: "Reported at dusk. The harbour office says Thursday, which means next week.",
        meta: "Harbour",
      },
    },
    "card-count": {
      id: "card-count",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Tern count, evening: forty-one",
        summary: "Up nine on last night, and the wardens think the second wave has arrived.",
        meta: "Shoreline",
        badge: "updated",
      },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Late edition — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
