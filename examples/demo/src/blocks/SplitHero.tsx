import type { InferProps } from "@nubbin/core";
import type { splitHeroSchema } from "./SplitHero.schema";
import { TONE_SURFACE } from "./tone.constants";

type SplitHeroProps = InferProps<typeof splitHeroSchema>;

/** The text half stays first in the markup either way — the media holds nothing focusable, so
 * moving it visually with an order class leaves reading order and tab order untouched. */
const MEDIA_SIDE_STYLES = {
  start: "md:order-first",
  end: "md:order-last",
} as const;

/** Half text, half media. Without an image the text takes the full measure — the grid only
 * splits when there is a second half to give the other column to. */
export function SplitHero({ headline, body, mediaSide, image, cta }: SplitHeroProps) {
  const columns = image === undefined ? "" : " md:grid-cols-2 md:items-center";
  return (
    <section data-nubbin-block="SplitHero" className={`${TONE_SURFACE.light} px-6 py-16`}>
      <div className={`mx-auto grid max-w-6xl gap-12${columns}`}>
        <div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-md text-lg text-marine/70">{body}</p>
          {cta === undefined ? null : (
            <a
              href={cta.href}
              className="mt-8 inline-block rounded-md border border-orange-deep bg-orange-deep px-6 py-3 text-sm font-semibold text-white underline-offset-4 hover:underline"
            >
              {cta.label}
            </a>
          )}
        </div>
        {image === undefined ? null : (
          <img
            src={image.url}
            alt={image.alt}
            className={`w-full max-w-lg justify-self-center ${MEDIA_SIDE_STYLES[mediaSide]}`}
          />
        )}
      </div>
    </section>
  );
}
