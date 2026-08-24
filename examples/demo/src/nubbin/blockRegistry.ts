import { defineRegistry } from "@nubbin/react";

/** The literal map the bundler splits into one chunk per block. Values resolve to the component
 * itself, which is what the renderer invokes — a module namespace is not callable. */
export const blockRegistry = defineRegistry({
  Hero: () => import("../blocks/Hero").then((module) => module.Hero),
  SplitHero: () => import("../blocks/SplitHero").then((module) => module.SplitHero),
  VideoHero: () => import("../blocks/VideoHero").then((module) => module.VideoHero),
  AnnouncementBar: () =>
    import("../blocks/AnnouncementBar").then((module) => module.AnnouncementBar),
  CountdownBanner: () =>
    import("../blocks/CountdownBanner").then((module) => module.CountdownBanner),
  FeatureGrid: () => import("../blocks/FeatureGrid").then((module) => module.FeatureGrid),
  Prose: () => import("../blocks/Prose").then((module) => module.Prose),
  FaqAccordion: () => import("../blocks/FaqAccordion").then((module) => module.FaqAccordion),
  CtaBanner: () => import("../blocks/CtaBanner").then((module) => module.CtaBanner),
  Quote: () => import("../blocks/Quote").then((module) => module.Quote),
  ImageFigure: () => import("../blocks/ImageFigure").then((module) => module.ImageFigure),
  Gallery: () => import("../blocks/Gallery").then((module) => module.Gallery),
  LogoWall: () => import("../blocks/LogoWall").then((module) => module.LogoWall),
  StatBand: () => import("../blocks/StatBand").then((module) => module.StatBand),
  PageHeader: () => import("../blocks/PageHeader").then((module) => module.PageHeader),
  SiteFooter: () => import("../blocks/SiteFooter").then((module) => module.SiteFooter),
  SectionStack: () => import("../blocks/SectionStack").then((module) => module.SectionStack),
  Split: () => import("../blocks/Split").then((module) => module.Split),
  CardGrid: () => import("../blocks/CardGrid").then((module) => module.CardGrid),
  Card: () => import("../blocks/Card").then((module) => module.Card),
  LiveBand: () => import("../blocks/LiveBand").then((module) => module.LiveBand),
  UpdateFeed: () => import("../blocks/UpdateFeed").then((module) => module.UpdateFeed),
  ProductCard: () => import("../blocks/ProductCard").then((module) => module.ProductCard),
  ProductGrid: () => import("../blocks/ProductGrid").then((module) => module.ProductGrid),
  PriceList: () => import("../blocks/PriceList").then((module) => module.PriceList),
  SiteHeader: () => import("../blocks/SiteHeader").then((module) => module.SiteHeader),
});
