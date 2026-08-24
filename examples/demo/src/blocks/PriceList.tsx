import type { InferProps } from "@nubbin/core";
import type { priceListSchema } from "./PriceList.schema";
import { TONE_SURFACE } from "./tone.constants";

type PriceListProps = InferProps<typeof priceListSchema>;

/**
 * The chandlery's price board as a definition list — each item defines its price, which is
 * how a screen reader keeps the pair together. The rule between rows does the aligning; no
 * dotted leaders, because they read out loud as punctuation.
 */
export function PriceList({ heading, rows }: PriceListProps) {
  return (
    <section data-nubbin-block="PriceList" className={`${TONE_SURFACE.light} px-6 py-14`}>
      <div className="mx-auto max-w-2xl">
        {heading === undefined ? (
          <h2 className="sr-only">Prices</h2>
        ) : (
          <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
        )}
        <dl className="mt-8 divide-y divide-brass/30 border-y border-brass/30">
          {rows.map((row) => (
            <div key={row.item} className="flex items-baseline justify-between gap-6 py-3">
              <dt className="text-sm">{row.item}</dt>
              <dd className="shrink-0 text-sm font-semibold">{row.price}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
