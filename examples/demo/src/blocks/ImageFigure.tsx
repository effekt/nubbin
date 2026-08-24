import type { InferProps } from "@nubbin/core";
import type { imageFigureSchema } from "./ImageFigure.schema";
import { TONE_SURFACE } from "./tone.constants";

type ImageFigureProps = InferProps<typeof imageFigureSchema>;

/** `text` matches `Prose`'s measure so a figure between paragraphs keeps their edge; `full`
 * lets the picture run to the bleed while its caption stays at the reading measure. */
const WIDTH_STYLES = {
  text: { media: "max-w-3xl px-6", caption: "max-w-3xl px-6" },
  wide: { media: "max-w-5xl px-6", caption: "max-w-5xl px-6" },
  full: { media: "", caption: "max-w-3xl px-6" },
} as const;

/**
 * A picture set into the page as content, not furniture: the root is a `figure`, so the
 * caption and credit are tied to the image in the outline rather than floating under it.
 * The caption speaks to everyone; `alt` still names the content for a reader who cannot
 * see it, because the two say different things.
 */
export function ImageFigure({ image, caption, credit, width }: ImageFigureProps) {
  const styles = WIDTH_STYLES[width];
  return (
    <figure data-nubbin-block="ImageFigure" className={`${TONE_SURFACE.light} py-10`}>
      <div className={`mx-auto ${styles.media}`}>
        <img src={image.url} alt={image.alt} className="w-full" />
      </div>
      {caption === undefined && credit === undefined ? null : (
        <figcaption className={`mx-auto mt-3 text-sm text-marine/70 ${styles.caption}`}>
          {caption}
          {credit === undefined ? null : (
            <span className="mt-1 block text-xs uppercase tracking-widest">{credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
