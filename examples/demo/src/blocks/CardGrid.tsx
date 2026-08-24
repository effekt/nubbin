import type { InferProps } from "@nubbin/core";
import type { ReactNode } from "react";
import type { cardGridSchema } from "./CardGrid.schema";

/** `cards` is the slot's rendered children, passed by the renderer — never schema data. */
type CardGridProps = InferProps<typeof cardGridSchema> & { cards?: ReactNode };

/** Full class names per column count, because Tailwind only compiles classes it can read. */
const COLUMN_STYLES = {
  two: "sm:grid-cols-2",
  three: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/** No surface classes of its own: the grid inherits whatever tone its parent set, so the
 * same block works on canvas, inside a dark split, or under a hero. */
export function CardGrid({ heading, columns, cards }: CardGridProps) {
  return (
    <section data-nubbin-block="CardGrid" className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {heading === undefined ? null : (
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight">
            {heading}
          </h2>
        )}
        <div className={`mt-8 grid gap-6 ${COLUMN_STYLES[columns]}`}>{cards}</div>
      </div>
    </section>
  );
}
