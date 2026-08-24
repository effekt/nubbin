import { Card } from "@/blocks/Card";
import { CardGrid } from "@/blocks/CardGrid";
import { CtaBanner } from "@/blocks/CtaBanner";
import { cardDefaults } from "@/blocks/cardDefaults";
import { cardGridDefaults } from "@/blocks/cardGridDefaults";
import { ctaBannerDefaults } from "@/blocks/ctaBannerDefaults";
import { FaqAccordion } from "@/blocks/FaqAccordion";
import { FeatureGrid } from "@/blocks/FeatureGrid";
import { faqAccordionDefaults } from "@/blocks/faqAccordionDefaults";
import { featureGridDefaults } from "@/blocks/featureGridDefaults";
import { Hero } from "@/blocks/Hero";
import { heroDefaults } from "@/blocks/heroDefaults";
import { LiveBand } from "@/blocks/LiveBand";
import { liveBandDefaults } from "@/blocks/liveBandDefaults";
import { PageHeader } from "@/blocks/PageHeader";
import { Prose } from "@/blocks/Prose";
import { pageHeaderDefaults } from "@/blocks/pageHeaderDefaults";
import { proseDefaults } from "@/blocks/proseDefaults";
import { SiteFooter } from "@/blocks/SiteFooter";
import { Split } from "@/blocks/Split";
import { siteFooterDefaults } from "@/blocks/siteFooterDefaults";
import { splitDefaults } from "@/blocks/splitDefaults";
import { UpdateFeed } from "@/blocks/UpdateFeed";
import { updateFeedDefaults } from "@/blocks/updateFeedDefaults";

/**
 * Every block's own `defaults`, rendered unmodified — the same content an author sees dropping a
 * fresh block onto a canvas, and the only page here that proves each default satisfies its own
 * schema by being rendered rather than by being asserted.
 *
 * The slotted blocks are shown holding children, because a slot rendered empty demonstrates
 * nothing: `Split` is the one block with two of them, and `CardGrid` accepts `Card` and nothing
 * else.
 */
export default function ReferencePage() {
  return (
    <main>
      <Hero {...heroDefaults} />
      <LiveBand {...liveBandDefaults} />
      <PageHeader {...pageHeaderDefaults} />
      {/* Slots arrive as props named after them, never as children — the renderer passes
          each slot's rendered children under its own name. */}
      <Split
        {...splitDefaults}
        start={
          <CardGrid
            {...cardGridDefaults}
            cards={
              <>
                <Card {...cardDefaults} />
                <Card {...cardDefaults} badge="new" />
                <Card {...cardDefaults} badge="updated" />
              </>
            }
          />
        }
        end={<UpdateFeed {...updateFeedDefaults} />}
      />
      <Prose {...proseDefaults} />
      <FeatureGrid {...featureGridDefaults} />
      <FaqAccordion {...faqAccordionDefaults} />
      <CtaBanner {...ctaBannerDefaults} />
      <SiteFooter {...siteFooterDefaults} />
    </main>
  );
}
