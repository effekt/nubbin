import type { InferProps } from "@nubbin/core";
import type { statBandSchema } from "./StatBand.schema";
import { TONE_ACCENT, TONE_SURFACE } from "./tone.constants";

type StatBandProps = InferProps<typeof statBandSchema>;

const TONE_STYLES = {
  light: {
    section: TONE_SURFACE.light,
    value: TONE_ACCENT.light,
    label: "text-marine/70",
  },
  dark: {
    section: TONE_SURFACE.dark,
    value: TONE_ACCENT.dark,
    label: "text-canvas/75",
  },
} as const;

/** Full class names per count, because Tailwind only compiles classes it can read. */
const COLUMN_STYLES: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Figures in a band, read the way they are seen: value first, label under it, in one list —
 * a `dl` was rejected because its content model wants the term before the definition, and
 * reversing that visually would split reading order from the page. A band with no heading
 * still gets one in the outline, visible only to assistive tech.
 */
export function StatBand({ heading, stats, tone }: StatBandProps) {
  const styles = TONE_STYLES[tone];
  return (
    <section data-nubbin-block="StatBand" className={`${styles.section} px-6 py-14`}>
      <div className="mx-auto max-w-5xl">
        {heading === undefined ? (
          <h2 className="sr-only">The paper in numbers</h2>
        ) : (
          <h2 className="text-balance text-center text-3xl font-semibold tracking-tight">
            {heading}
          </h2>
        )}
        <ul className={`mt-10 grid gap-8 text-center ${COLUMN_STYLES[stats.length] ?? ""}`}>
          {stats.map((stat) => (
            <li key={stat.label}>
              <span className={`block text-5xl font-semibold tracking-tight ${styles.value}`}>
                {stat.value}
              </span>
              <span className={`mt-2 block text-sm ${styles.label}`}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
