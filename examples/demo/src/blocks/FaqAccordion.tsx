import type { InferProps } from "@nubbin/core";
import type { faqAccordionSchema } from "./FaqAccordion.schema";
import { FaqDisclosureGroup } from "./FaqDisclosureGroup";
import { TONE_SURFACE } from "./tone.constants";

type FaqAccordionProps = InferProps<typeof faqAccordionSchema>;

const TONE_STYLES = {
  light: { section: TONE_SURFACE.light, item: "border-brass/30" },
  dark: { section: TONE_SURFACE.dark, item: "border-teal-light/20" },
} as const;

/**
 * A server component with a host root, holding a client component inside it — the only shape a
 * block can take, since `invokeBlock` stamps the root by cloning it and a client reference is not
 * a host element. The disclosure list moved into `FaqDisclosureGroup` so it can hold the one
 * piece of state `<details>` cannot: whether they all move together.
 */
export function FaqAccordion({ heading, tone, items }: FaqAccordionProps) {
  const styles = TONE_STYLES[tone];
  return (
    <section data-nubbin-block="FaqAccordion" className={`${styles.section} px-6 py-24`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-balance text-3xl font-semibold tracking-tight">{heading}</h2>
        <FaqDisclosureGroup items={items} itemClassName={styles.item} />
      </div>
    </section>
  );
}
