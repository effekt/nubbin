import type { InferProps } from "@nubbin/core";
import type { productCardSchema } from "./ProductCard.schema";

type ProductCardProps = InferProps<typeof productCardSchema>;

/** The stored value is lowercase and closed; the visible wording lives here, in one place. */
const BADGE_LABELS: Record<NonNullable<ProductCardProps["badge"]>, string> = {
  new: "New",
  "back-in-stock": "Back in stock",
};

/** The white fill and brass border match `Card`, so a page mixing dispatches and shelf
 * stock reads as one design. The price is text beside the name, never a figure the page
 * computes with — the paper reports what the board says. */
export function ProductCard({ name, price, description, image, href, badge }: ProductCardProps) {
  return (
    <article
      data-nubbin-block="ProductCard"
      className="rounded-lg border border-brass/30 bg-white p-6 text-marine"
    >
      {image === undefined ? null : <img src={image.url} alt={image.alt} className="mb-4 w-full" />}
      {badge === undefined ? null : (
        <span className="mb-3 inline-block rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal">
          {BADGE_LABELS[badge]}
        </span>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-semibold">
          {href === undefined ? (
            name
          ) : (
            <a href={href} className="underline-offset-4 hover:underline">
              {name}
            </a>
          )}
        </h3>
        <p className="shrink-0 text-sm font-semibold">{price}</p>
      </div>
      <p className="mt-2 text-sm text-marine/70">{description}</p>
    </article>
  );
}
