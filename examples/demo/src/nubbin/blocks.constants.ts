import type { Block } from "@nubbin/core";
import { announcementBarBlock } from "../blocks/AnnouncementBar.block";
import { cardBlock } from "../blocks/Card.block";
import { cardGridBlock } from "../blocks/CardGrid.block";
import { countdownBannerBlock } from "../blocks/CountdownBanner.block";
import { ctaBannerBlock } from "../blocks/CtaBanner.block";
import { faqAccordionBlock } from "../blocks/FaqAccordion.block";
import { featureGridBlock } from "../blocks/FeatureGrid.block";
import { heroBlock } from "../blocks/Hero.block";
import { liveBandBlock } from "../blocks/LiveBand.block";
import { pageHeaderBlock } from "../blocks/PageHeader.block";
import { proseBlock } from "../blocks/Prose.block";
import { sectionStackBlock } from "../blocks/SectionStack.block";
import { siteFooterBlock } from "../blocks/SiteFooter.block";
import { splitBlock } from "../blocks/Split.block";
import { splitHeroBlock } from "../blocks/SplitHero.block";
import { updateFeedBlock } from "../blocks/UpdateFeed.block";
import { videoHeroBlock } from "../blocks/VideoHero.block";

/**
 * The blocks this site curates, as a list rather than a built registry, so the compatibility
 * guardrail can register a deliberately altered set beside the real one and prove its detector
 * still fires. `registry.ts` is the one built from it.
 */
export const BLOCKS: Block[] = [
  heroBlock,
  splitHeroBlock,
  videoHeroBlock,
  announcementBarBlock,
  countdownBannerBlock,
  featureGridBlock,
  proseBlock,
  faqAccordionBlock,
  ctaBannerBlock,
  pageHeaderBlock,
  siteFooterBlock,
  sectionStackBlock,
  splitBlock,
  cardGridBlock,
  cardBlock,
  liveBandBlock,
  updateFeedBlock,
];
