import { defineCatalog } from "@nubbin/core";
import { announcementBarSchema } from "../blocks/AnnouncementBar.schema";
import { announcementBarDefaults } from "../blocks/announcementBarDefaults";
import { cardSchema } from "../blocks/Card.schema";
import { cardGridSchema } from "../blocks/CardGrid.schema";
import { countdownBannerSchema } from "../blocks/CountdownBanner.schema";
import { ctaBannerSchema } from "../blocks/CtaBanner.schema";
import { cardDefaults } from "../blocks/cardDefaults";
import { cardGridDefaults } from "../blocks/cardGridDefaults";
import { countdownBannerDefaults } from "../blocks/countdownBannerDefaults";
import { ctaBannerDefaults } from "../blocks/ctaBannerDefaults";
import { faqAccordionSchema } from "../blocks/FaqAccordion.schema";
import { featureGridSchema } from "../blocks/FeatureGrid.schema";
import { faqAccordionDefaults } from "../blocks/faqAccordionDefaults";
import { featureGridDefaults } from "../blocks/featureGridDefaults";
import { gallerySchema } from "../blocks/Gallery.schema";
import { galleryDefaults } from "../blocks/galleryDefaults";
import { heroSchema } from "../blocks/Hero.schema";
import { heroDefaults } from "../blocks/heroDefaults";
import { imageFigureSchema } from "../blocks/ImageFigure.schema";
import { imageFigureDefaults } from "../blocks/imageFigureDefaults";
import { liveBandSchema } from "../blocks/LiveBand.schema";
import { logoWallSchema } from "../blocks/LogoWall.schema";
import { liveBandDefaults } from "../blocks/liveBandDefaults";
import { logoWallDefaults } from "../blocks/logoWallDefaults";
import { pageHeaderSchema } from "../blocks/PageHeader.schema";
import { proseSchema } from "../blocks/Prose.schema";
import { pageHeaderDefaults } from "../blocks/pageHeaderDefaults";
import { proseDefaults } from "../blocks/proseDefaults";
import { quoteSchema } from "../blocks/Quote.schema";
import { quoteDefaults } from "../blocks/quoteDefaults";
import { sectionStackSchema } from "../blocks/SectionStack.schema";
import { siteFooterSchema } from "../blocks/SiteFooter.schema";
import { splitSchema } from "../blocks/Split.schema";
import { splitHeroSchema } from "../blocks/SplitHero.schema";
import { statBandSchema } from "../blocks/StatBand.schema";
import { sectionStackDefaults } from "../blocks/sectionStackDefaults";
import { siteFooterDefaults } from "../blocks/siteFooterDefaults";
import { splitDefaults } from "../blocks/splitDefaults";
import { splitHeroDefaults } from "../blocks/splitHeroDefaults";
import { statBandDefaults } from "../blocks/statBandDefaults";
import { updateFeedSchema } from "../blocks/UpdateFeed.schema";
import { updateFeedDefaults } from "../blocks/updateFeedDefaults";
import { videoHeroSchema } from "../blocks/VideoHero.schema";
import { videoHeroDefaults } from "../blocks/videoHeroDefaults";

/**
 * The serializable half of the split — what a studio would fetch to build its palette and
 * inspector. Three fields carry a `data` hint, and those are the only three the compiler turns
 * into holes; every other field freezes into the artifact.
 *
 * The two new ones are what a reader watches change: a strip of what is happening now, and the
 * record of what moved. Neither could be frozen at publish and still be true a minute later.
 *
 * Every field holding a destination — an href, an image or video URL — carries
 * `control: "link"`, which the studio renders as its link control. Compile reads none of them.
 */
export const catalog = defineCatalog({
  Hero: {
    schema: heroSchema,
    defaults: heroDefaults,
    ui: { fields: { "cta.href": { control: "link" }, "image.url": { control: "link" } } },
  },
  SplitHero: {
    schema: splitHeroSchema,
    defaults: splitHeroDefaults,
    ui: { fields: { "cta.href": { control: "link" }, "image.url": { control: "link" } } },
  },
  VideoHero: {
    schema: videoHeroSchema,
    defaults: videoHeroDefaults,
    ui: { fields: { videoUrl: { control: "link" }, "poster.url": { control: "link" } } },
  },
  AnnouncementBar: {
    schema: announcementBarSchema,
    defaults: announcementBarDefaults,
    ui: { fields: { href: { control: "link" } } },
  },
  CountdownBanner: { schema: countdownBannerSchema, defaults: countdownBannerDefaults },
  FeatureGrid: { schema: featureGridSchema, defaults: featureGridDefaults },
  Prose: { schema: proseSchema, defaults: proseDefaults },
  FaqAccordion: {
    schema: faqAccordionSchema,
    defaults: faqAccordionDefaults,
    ui: { fields: { items: { data: { revalidate: 5 } } } },
  },
  CtaBanner: {
    schema: ctaBannerSchema,
    defaults: ctaBannerDefaults,
    ui: { fields: { "cta.href": { control: "link" } } },
  },
  Quote: { schema: quoteSchema, defaults: quoteDefaults },
  ImageFigure: {
    schema: imageFigureSchema,
    defaults: imageFigureDefaults,
    ui: { fields: { "image.url": { control: "link" } } },
  },
  Gallery: {
    schema: gallerySchema,
    defaults: galleryDefaults,
    ui: { fields: { "items[].url": { control: "link" } } },
  },
  LogoWall: {
    schema: logoWallSchema,
    defaults: logoWallDefaults,
    ui: { fields: { "items[].imageUrl": { control: "link" } } },
  },
  StatBand: { schema: statBandSchema, defaults: statBandDefaults },
  PageHeader: { schema: pageHeaderSchema, defaults: pageHeaderDefaults },
  SiteFooter: {
    schema: siteFooterSchema,
    defaults: siteFooterDefaults,
    ui: { fields: { "columns[].links[].href": { control: "link" } } },
  },
  SectionStack: { schema: sectionStackSchema, defaults: sectionStackDefaults },
  Split: { schema: splitSchema, defaults: splitDefaults },
  CardGrid: { schema: cardGridSchema, defaults: cardGridDefaults },
  Card: {
    schema: cardSchema,
    defaults: cardDefaults,
    ui: { fields: { href: { control: "link" } } },
  },
  LiveBand: {
    schema: liveBandSchema,
    defaults: liveBandDefaults,
    ui: { fields: { items: { data: { revalidate: 5 } } } },
  },
  UpdateFeed: {
    schema: updateFeedSchema,
    defaults: updateFeedDefaults,
    ui: { fields: { entries: { data: { revalidate: 5 } } } },
  },
});
