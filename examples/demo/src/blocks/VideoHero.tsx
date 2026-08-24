import type { InferProps } from "@nubbin/core";
import { TONE_SURFACE } from "./tone.constants";
import type { videoHeroSchema } from "./VideoHero.schema";

type VideoHeroProps = InferProps<typeof videoHeroSchema>;

/** Decorative washes only — the overlay never sits under text, so contrast never depends on
 * it, and `pointer-events-none` keeps the native controls reachable underneath. */
const OVERLAY_STYLES = {
  dawn: "pointer-events-none absolute inset-0 bg-gradient-to-t from-orange/30 to-transparent",
  dusk: "pointer-events-none absolute inset-0 bg-gradient-to-t from-teal/40 to-transparent",
} as const;

/**
 * The poster is the presentation and the video is the reader's choice: no `autoPlay`, so
 * nothing moves until the native controls are used, which is the strongest reduced-motion
 * stance available. Once started it runs muted and loops — ambience, not an announcement.
 */
export function VideoHero({ headline, videoUrl, poster, overlay }: VideoHeroProps) {
  return (
    <section data-nubbin-block="VideoHero" className={`${TONE_SURFACE.dark} px-6 py-16`}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {headline}
        </h1>
        <div className="relative mt-8 overflow-hidden rounded-md border border-teal-light/40">
          <video
            src={videoUrl}
            poster={poster.url}
            aria-label={poster.alt}
            controls
            muted
            loop
            playsInline
            preload="none"
            className="w-full"
          />
          {overlay === "none" ? null : (
            <div aria-hidden="true" className={OVERLAY_STYLES[overlay]} />
          )}
        </div>
      </div>
    </section>
  );
}
