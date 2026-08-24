import type { DocumentVersion } from "@nubbin/core";
import { priceListDefaults } from "../src/blocks/priceListDefaults";
import { productCardDefaults } from "../src/blocks/productCardDefaults";
import { productGridDefaults } from "../src/blocks/productGridDefaults";
import { siteHeaderDefaults } from "../src/blocks/siteHeaderDefaults";

/** The back counter as a page: what the paper sells, and what the board says it costs. */
export const chandlery: DocumentVersion = {
  documentId: "chandlery",
  version: 1,
  roots: ["stack"],
  elements: {
    stack: {
      id: "stack",
      block: "SectionStack",
      props: {},
      slots: { sections: ["masthead", "shelf", "board"] },
    },
    masthead: { id: "masthead", block: "SiteHeader", props: siteHeaderDefaults },
    shelf: {
      id: "shelf",
      block: "ProductGrid",
      props: productGridDefaults,
      slots: { products: ["tide-card", "chart", "subscription"] },
    },
    "tide-card": {
      id: "tide-card",
      block: "ProductCard",
      props: {
        ...productCardDefaults,
        image: {
          url: "/figures/tide-gauge.svg",
          alt: "The tide gauge at the harbour arm, drawn for the corrected card",
        },
        badge: "new",
      },
    },
    chart: {
      id: "chart",
      block: "ProductCard",
      props: {
        name: "Harbour chart reprint, 1907 survey",
        price: "£12",
        description:
          "The survey the harbour office still keeps under glass, reprinted at a size that fits a chart table.",
        image: {
          url: "/figures/harbour-arm.svg",
          alt: "The harbour arm as the 1907 survey drew it",
        },
        badge: "back-in-stock",
      },
    },
    subscription: {
      id: "subscription",
      block: "ProductCard",
      props: {
        name: "A year of the paper, posted",
        price: "£38",
        description:
          "Every dispatch for a year, folded once and posted the morning it prints. The fog weeks arrive late, like everything else.",
      },
    },
    board: { id: "board", block: "PriceList", props: priceListDefaults },
  },
  meta: { title: "The chandlery — Bellwether" },
  createdAt: "2026-08-24T05:00:00Z",
  createdBy: "fixtures",
};
