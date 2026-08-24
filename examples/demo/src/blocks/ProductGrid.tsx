import type { InferProps } from "@nubbin/core";
import type { ReactNode } from "react";
import type { productGridSchema } from "./ProductGrid.schema";

/** `products` is the slot's rendered children, passed by the renderer — never schema data. */
type ProductGridProps = InferProps<typeof productGridSchema> & { products?: ReactNode };

/**
 * A shelf of `ProductCard`s, three across where the room allows. No surface classes of its
 * own: the grid inherits whatever tone its parent set. Without a heading the shelf still
 * names itself to assistive tech, the way `Gallery` does — a run of cards with no label is
 * a hole in the outline.
 */
export function ProductGrid({ heading, products }: ProductGridProps) {
  return (
    <section data-nubbin-block="ProductGrid" className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {heading === undefined ? (
          <h2 className="sr-only">For sale</h2>
        ) : (
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight">
            {heading}
          </h2>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products}</div>
      </div>
    </section>
  );
}
