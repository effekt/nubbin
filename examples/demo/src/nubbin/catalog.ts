import { defineCatalog } from "@nubbin/core";
import { cardSchema } from "../blocks/Card.schema";
import { cardGridSchema } from "../blocks/CardGrid.schema";
import { ctaBannerSchema } from "../blocks/CtaBanner.schema";
import { cardDefaults } from "../blocks/cardDefaults";
import { cardGridDefaults } from "../blocks/cardGridDefaults";
import { ctaBannerDefaults } from "../blocks/ctaBannerDefaults";
import { faqAccordionSchema } from "../blocks/FaqAccordion.schema";
import { featureGridSchema } from "../blocks/FeatureGrid.schema";
import { faqAccordionDefaults } from "../blocks/faqAccordionDefaults";
import { featureGridDefaults } from "../blocks/featureGridDefaults";
import { heroSchema } from "../blocks/Hero.schema";
import { heroDefaults } from "../blocks/heroDefaults";
import { liveBandSchema } from "../blocks/LiveBand.schema";
import { liveBandDefaults } from "../blocks/liveBandDefaults";
import { pageHeaderSchema } from "../blocks/PageHeader.schema";
import { proseSchema } from "../blocks/Prose.schema";
import { pageHeaderDefaults } from "../blocks/pageHeaderDefaults";
import { proseDefaults } from "../blocks/proseDefaults";
import { sectionStackSchema } from "../blocks/SectionStack.schema";
import { siteFooterSchema } from "../blocks/SiteFooter.schema";
import { splitSchema } from "../blocks/Split.schema";
import { sectionStackDefaults } from "../blocks/sectionStackDefaults";
import { siteFooterDefaults } from "../blocks/siteFooterDefaults";
import { splitDefaults } from "../blocks/splitDefaults";
import { updateFeedSchema } from "../blocks/UpdateFeed.schema";
import { updateFeedDefaults } from "../blocks/updateFeedDefaults";

/**
 * The serializable half of the split — what a studio would fetch to build its palette and
 * inspector. Three fields carry a `data` hint, and those are the only three the compiler turns
 * into holes; every other field freezes into the artifact.
 *
 * The two new ones are what a reader watches change: a strip of what is happening now, and the
 * record of what moved. Neither could be frozen at publish and still be true a minute later.
 */
export const catalog = defineCatalog({
  Hero: { schema: heroSchema, defaults: heroDefaults },
  FeatureGrid: { schema: featureGridSchema, defaults: featureGridDefaults },
  Prose: { schema: proseSchema, defaults: proseDefaults },
  FaqAccordion: {
    schema: faqAccordionSchema,
    defaults: faqAccordionDefaults,
    ui: { fields: { items: { data: { revalidate: 5 } } } },
  },
  CtaBanner: { schema: ctaBannerSchema, defaults: ctaBannerDefaults },
  PageHeader: { schema: pageHeaderSchema, defaults: pageHeaderDefaults },
  SiteFooter: { schema: siteFooterSchema, defaults: siteFooterDefaults },
  SectionStack: { schema: sectionStackSchema, defaults: sectionStackDefaults },
  Split: { schema: splitSchema, defaults: splitDefaults },
  CardGrid: { schema: cardGridSchema, defaults: cardGridDefaults },
  Card: { schema: cardSchema, defaults: cardDefaults },
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
