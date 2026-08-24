import type { InferProps } from "@nubbin/core";
import type { cardSchema } from "./Card.schema";

type CardProps = InferProps<typeof cardSchema>;

/** The stored value is lowercase and closed; the visible wording lives here, in one place. */
const BADGE_LABELS: Record<NonNullable<CardProps["badge"]>, string> = {
  new: "New",
  updated: "Updated",
};

/** The white fill and brass border match the FeatureGrid card, so a page mixing both grids
 * reads as one design. Teal on white measures 7.04:1, so the pill text clears AA easily. */
export function Card({ title, summary, href, meta, badge }: CardProps) {
  return (
    <article
      data-nubbin-block="Card"
      className="rounded-lg border border-brass/30 bg-white p-6 text-marine"
    >
      {badge === undefined ? null : (
        <span className="mb-3 inline-block rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal">
          {BADGE_LABELS[badge]}
        </span>
      )}
      <h3 className="font-semibold">
        {href === undefined ? (
          title
        ) : (
          <a href={href} className="underline-offset-4 hover:underline">
            {title}
          </a>
        )}
      </h3>
      <p className="mt-2 text-sm text-marine/70">{summary}</p>
      {meta === undefined ? null : <p className="mt-4 text-xs text-marine/70">{meta}</p>}
    </article>
  );
}
