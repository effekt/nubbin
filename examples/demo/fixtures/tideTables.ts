import type { DocumentVersion } from "@nubbin/core";
import { cardDefaults } from "../src/blocks/cardDefaults";
import { cardGridDefaults } from "../src/blocks/cardGridDefaults";
import { ctaBannerDefaults } from "../src/blocks/ctaBannerDefaults";
import { pageHeaderDefaults } from "../src/blocks/pageHeaderDefaults";
import { proseDefaults } from "../src/blocks/proseDefaults";
import { siteFooterDefaults } from "../src/blocks/siteFooterDefaults";
import { splitDefaults } from "../src/blocks/splitDefaults";

/** One piece, with prose in the wide pane and what it relates to beside it. */
export const tideTables: DocumentVersion = {
  documentId: "tide-tables",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["header", "split", "cta", "footer"] },
    },
    header: {
      id: "header",
      block: "PageHeader",
      props: {
        ...pageHeaderDefaults,
        eyebrow: "Field notes",
        headline: "Tide tables corrected for Whitstable",
        body: "The published table ran four minutes fast all spring.",
      },
    },
    split: {
      id: "split",
      block: "Split",
      props: { ...splitDefaults, ratio: "wide-start" },
      slots: { start: ["body"], end: ["related"] },
    },
    body: { id: "body", block: "Prose", props: proseDefaults },
    related: {
      id: "related",
      block: "CardGrid",
      props: { ...cardGridDefaults, heading: "Related", columns: "two" },
      slots: { cards: ["card-ferry", "card-slip"] },
    },
    "card-ferry": {
      id: "card-ferry",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "The ferry holds to winter hours",
        summary: "The crossing reads the same table, four minutes and all.",
        meta: "Crossings",
      },
    },
    "card-slip": {
      id: "card-slip",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Slipway hours follow the corrected table",
        summary: "Four minutes matters on a slipway, which is where this was noticed.",
        meta: "Harbour",
        badge: "updated",
      },
    },
    cta: {
      id: "cta",
      block: "CtaBanner",
      props: {
        ...ctaBannerDefaults,
        heading: "Corrections reach the page before they reach print",
      },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Tide tables corrected — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
