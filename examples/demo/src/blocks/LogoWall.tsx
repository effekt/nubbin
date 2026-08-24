import type { InferProps } from "@nubbin/core";
import type { logoWallSchema } from "./LogoWall.schema";

type LogoWallProps = InferProps<typeof logoWallSchema>;

/**
 * No surface classes of its own, like `CardGrid`: the wall inherits its parent's tone. A
 * mark without an image renders as set text rather than an empty box, so the block looks
 * inhabited from the first name — and the image's alt is the mark's own name, because a
 * logo says nothing an unstyled name does not.
 */
export function LogoWall({ heading, items }: LogoWallProps) {
  return (
    <section data-nubbin-block="LogoWall" className="px-6 py-12">
      <div className="mx-auto max-w-5xl text-center">
        {heading === undefined ? (
          <h2 className="sr-only">Who carries the paper</h2>
        ) : (
          <h2 className="text-sm font-semibold uppercase tracking-widest">{heading}</h2>
        )}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {items.map((item) => (
            <li key={item.name}>
              {item.imageUrl === undefined ? (
                <span className="font-serif text-lg tracking-tight">{item.name}</span>
              ) : (
                <img src={item.imageUrl} alt={item.name} className="h-8 w-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
