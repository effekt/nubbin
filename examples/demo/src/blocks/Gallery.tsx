import type { InferProps } from "@nubbin/core";
import type { gallerySchema } from "./Gallery.schema";
import { TONE_SURFACE } from "./tone.constants";

type GalleryProps = InferProps<typeof gallerySchema>;

/** `strip` scrolls sideways rather than wrapping — nothing in a row is focusable, so the
 * overflow container carries no tab stop and keyboard readers get every caption in order. */
const LAYOUT_STYLES = {
  grid: { list: "grid grid-cols-2 gap-6 md:grid-cols-3", item: "" },
  strip: { list: "flex snap-x gap-6 overflow-x-auto pb-4", item: "w-64 shrink-0 snap-start" },
} as const;

/**
 * A curated set of pictures, each a small `figure` of its own so a caption stays with the
 * image it captions. Without a heading the set still names itself to assistive tech, the
 * way `LogoWall` does — a run of images with no label is a hole in the outline.
 */
export function Gallery({ heading, items, layout }: GalleryProps) {
  const styles = LAYOUT_STYLES[layout];
  return (
    <section data-nubbin-block="Gallery" className={`${TONE_SURFACE.light} px-6 py-14`}>
      <div className="mx-auto max-w-5xl">
        {heading === undefined ? (
          <h2 className="sr-only">In pictures</h2>
        ) : (
          <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
        )}
        <ul className={`mt-8 ${styles.list}`}>
          {items.map((item) => (
            <li key={item.url} className={styles.item}>
              <figure>
                <img src={item.url} alt={item.alt} className="w-full" />
                {item.caption === undefined ? null : (
                  <figcaption className="mt-2 text-sm text-marine/70">{item.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
