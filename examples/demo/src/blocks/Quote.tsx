import type { InferProps } from "@nubbin/core";
import type { quoteSchema } from "./Quote.schema";
import { TONE_ACCENT, TONE_SURFACE } from "./tone.constants";

type QuoteProps = InferProps<typeof quoteSchema>;

const TONE_STYLES = {
  light: {
    figure: TONE_SURFACE.light,
    mark: TONE_ACCENT.light,
    role: "text-marine/70",
  },
  dark: {
    figure: TONE_SURFACE.dark,
    mark: TONE_ACCENT.dark,
    role: "text-canvas/75",
  },
} as const;

/**
 * A pull-quote, not a paragraph: one voice set at heading size with the mark drawn as a
 * styled glyph — text the theme can recolour, where an image would freeze one ink into
 * every tone. The root is a `figure`, so the words sit in the outline of whatever section
 * quotes them rather than claiming a section of their own.
 */
export function Quote({ text, attribution, tone }: QuoteProps) {
  const styles = TONE_STYLES[tone];
  return (
    <figure data-nubbin-block="Quote" className={`${styles.figure} px-6 py-16`}>
      <div className="mx-auto max-w-3xl">
        <span
          aria-hidden="true"
          className={`block font-serif text-7xl leading-none ${styles.mark}`}
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          <p>{text}</p>
        </blockquote>
        <figcaption className="mt-6">
          <span className="font-semibold">{attribution.name}</span>
          {attribution.role === undefined ? null : (
            <span className={`block text-sm ${styles.role}`}>{attribution.role}</span>
          )}
        </figcaption>
      </div>
    </figure>
  );
}
