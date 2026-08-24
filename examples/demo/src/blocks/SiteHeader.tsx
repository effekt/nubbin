import type { InferProps } from "@nubbin/core";
import type { siteHeaderSchema } from "./SiteHeader.schema";
import { TONE_SURFACE } from "./tone.constants";

type SiteHeaderProps = InferProps<typeof siteHeaderSchema>;

/**
 * The top of every page: the paper's name and a labelled `nav` landmark, so a screen
 * reader jumps to it by name rather than walking the header. Every destination is a real
 * anchor — the header owns no behaviour, only where the paper goes.
 */
export function SiteHeader({ brand, links, tone }: SiteHeaderProps) {
  return (
    <header
      data-nubbin-block="SiteHeader"
      className={`${TONE_SURFACE[tone]} border-brass/30 border-b px-6 py-4`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="text-lg font-semibold tracking-tight">{brand}</p>
        <nav aria-label="Site">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {links.map((link) => (
              <li key={`${link.label}:${link.href}`}>
                <a href={link.href} className="text-sm underline-offset-4 hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
