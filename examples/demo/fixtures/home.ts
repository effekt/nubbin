import type { DocumentVersion } from "@nubbin/core";
import { announcementBarDefaults } from "../src/blocks/announcementBarDefaults";
import { cardDefaults } from "../src/blocks/cardDefaults";
import { cardGridDefaults } from "../src/blocks/cardGridDefaults";
import { countdownBannerDefaults } from "../src/blocks/countdownBannerDefaults";
import { ctaBannerDefaults } from "../src/blocks/ctaBannerDefaults";
import { faqAccordionDefaults } from "../src/blocks/faqAccordionDefaults";
import { heroDefaults } from "../src/blocks/heroDefaults";
import { liveBandDefaults } from "../src/blocks/liveBandDefaults";
import { logoWallDefaults } from "../src/blocks/logoWallDefaults";
import { quoteDefaults } from "../src/blocks/quoteDefaults";
import { siteFooterDefaults } from "../src/blocks/siteFooterDefaults";
import { splitDefaults } from "../src/blocks/splitDefaults";
import { updateFeedDefaults } from "../src/blocks/updateFeedDefaults";

/**
 * The deepest composition the demo has: a stack holding a split, one pane holding a grid, the
 * grid holding cards. Four levels, where every other page here was a flat list — which is the
 * shape a document actually has, and the shape nothing in this demo used to show.
 */
export const home: DocumentVersion = {
  documentId: "home",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: {
        sections: [
          "announce",
          "hero",
          "live",
          "split",
          "quote",
          "faq",
          "countdown",
          "cta",
          "wall",
          "footer",
        ],
      },
    },
    announce: { id: "announce", block: "AnnouncementBar", props: announcementBarDefaults },
    hero: {
      id: "hero",
      block: "Hero",
      props: {
        ...heroDefaults,
        headline: "The water tells you first",
        body: "Bellwether reads the estuary every morning — tides, wind, the ferry, the birds — and writes down what changed.",
      },
    },
    live: { id: "live", block: "LiveBand", props: liveBandDefaults },
    split: {
      id: "split",
      block: "Split",
      props: { ...splitDefaults, ratio: "wide-start" },
      slots: { start: ["grid"], end: ["updates"] },
    },
    grid: {
      id: "grid",
      block: "CardGrid",
      props: { ...cardGridDefaults, heading: "This morning's dispatches", columns: "three" },
      slots: {
        cards: ["card-tides", "card-ferry", "card-terns", "card-fog", "card-wall", "card-boats"],
      },
    },
    "card-tides": {
      id: "card-tides",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Tide tables corrected for Whitstable",
        summary: "The published table ran four minutes fast all spring. Here is the corrected set.",
        href: "/dispatches/tide-tables",
        meta: "Field notes",
        badge: "updated",
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
    "card-terns": {
      id: "card-terns",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Terns back on the shingle bank",
        summary: "Eleven days earlier than last year, and the wardens have roped the north end.",
        meta: "Shoreline",
        badge: "new",
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
        badge: "new",
      },
    },
    "card-boats": {
      id: "card-boats",
      block: "Card",
      props: {
        ...cardDefaults,
        title: "Three boats out of Faversham this week",
        summary: "Two dredging, one taking visitors as far as the bar and back on the ebb.",
        meta: "Crossings",
      },
    },
    updates: { id: "updates", block: "UpdateFeed", props: updateFeedDefaults },
    quote: { id: "quote", block: "Quote", props: { ...quoteDefaults, tone: "dark" } },
    wall: { id: "wall", block: "LogoWall", props: logoWallDefaults },
    faq: { id: "faq", block: "FaqAccordion", props: faqAccordionDefaults },
    countdown: { id: "countdown", block: "CountdownBanner", props: countdownBannerDefaults },
    cta: {
      id: "cta",
      block: "CtaBanner",
      props: { ...ctaBannerDefaults, heading: "The morning read, before the boats go out" },
    },
    footer: { id: "footer", block: "SiteFooter", props: siteFooterDefaults },
  },
  meta: { title: "Bellwether — dispatches from the estuary" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
