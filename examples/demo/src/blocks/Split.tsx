import type { InferProps } from "@nubbin/core";
import type { ReactNode } from "react";
import type { splitSchema } from "./Split.schema";
import { TONE_SURFACE } from "./tone.constants";

/** Slot children arrive already rendered, as props named after the slots — they are the
 * renderer's to pass and are never part of the schema, which holds only data. */
type SplitProps = InferProps<typeof splitSchema> & { start?: ReactNode; end?: ReactNode };

/** Full class names per ratio, because Tailwind only compiles classes it can read. The
 * `md:` prefix is the stacking behaviour: below it the grid is a single column. */
const RATIO_STYLES = {
  even: "md:grid-cols-2",
  "wide-start": "md:grid-cols-[2fr_1fr]",
  "wide-end": "md:grid-cols-[1fr_2fr]",
} as const;

/** Each pane gets a wrapper so a pane with three children is still one grid cell. */
export function Split({ ratio, tone, start, end }: SplitProps) {
  const surface = tone === undefined ? "" : ` ${TONE_SURFACE[tone]}`;
  return (
    <section data-nubbin-block="Split" className={`px-6 py-16${surface}`}>
      <div className={`mx-auto grid max-w-6xl items-start gap-8 ${RATIO_STYLES[ratio]}`}>
        <div>{start}</div>
        <div>{end}</div>
      </div>
    </section>
  );
}
