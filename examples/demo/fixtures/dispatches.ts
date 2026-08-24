import type { DocumentVersion } from "@nubbin/core";
import { cardDefaults } from "../src/blocks/cardDefaults";
import { cardGridDefaults } from "../src/blocks/cardGridDefaults";
import { featureGridDefaults } from "../src/blocks/featureGridDefaults";
import { pageHeaderDefaults } from "../src/blocks/pageHeaderDefaults";
import { siteFooterDefaults } from "../src/blocks/siteFooterDefaults";

/** The page an editor reorders: cards in a slot, and the order of that slot is the whole edit. */
export const dispatches: DocumentVersion = {
  documentId: "dispatches",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["header", "grid", "beats", "footer"] },
    },
    header: {
      id: "header",
      block: "PageHeader",
      props: {
        ...pageHeaderDefaults,
        eyebrow: "Dispatches",
        headline: "Everything we have written down",
        body: "Every piece we have filed, newest first. The order is an editor's decision, not a date sort.",
      },
    },
    grid: {
      id: "grid",
      block: "CardGrid",
      props: { ...cardGridDefaults, heading: undefined, columns: "three" },
      slots: { cards: ["card-tides", "card-terns", "card-ferry", "card-fog", "card-wall"] },
    },
    "card-tides": {
      id: "card-tides",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Tide tables corrected for Whitstable",
        summary:
          "Four minutes fast all spring, and nobody said anything until the oyster boats did.",
        href: "/dispatches/tide-tables",
        meta: "Field notes",
        badge: "updated",
      },
    },
    "card-terns": {
      id: "card-terns",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Terns back on the shingle bank",
        summary: "Eleven days early. The north end is roped until the chicks fledge.",
        meta: "Shoreline",
        badge: "new",
      },
    },
    "card-ferry": {
      id: "card-ferry",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "The ferry holds to winter hours",
        summary: "No change until the equinox, whatever the timetable board says.",
        meta: "Crossings",
      },
    },
    "card-fog": {
      id: "card-fog",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Sea fog, and why it stops at the wall",
        summary: "A warm land breeze meeting cold water does not travel far inland.",
        meta: "Weather",
      },
    },
    "card-wall": {
      id: "card-wall",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Repairs to the harbour wall begin Monday",
        summary: "The eastern arm closes to walkers for six weeks. The slipway stays open.",
        meta: "Harbour",
      },
    },
    beats: {
      id: "beats",
      block: "FeatureGrid",
      props: {
        ...featureGridDefaults,
        heading: "The beats every dispatch files under",
        tone: "dark",
        columns: 4,
      },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Dispatches — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
