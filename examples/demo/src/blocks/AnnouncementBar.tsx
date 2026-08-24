import type { InferProps } from "@nubbin/core";
import type { announcementBarSchema } from "./AnnouncementBar.schema";

type AnnouncementBarProps = InferProps<typeof announcementBarSchema>;

/** Both grounds clear AA under their ink: canvas on marine 13.5:1, white on orange-deep
 * 5.26:1 — `orange` itself never carries text, per the contrast table. */
const TONE_STYLES = {
  notice: "bg-marine text-canvas",
  urgent: "bg-orange-deep text-white",
} as const;

/**
 * One line above everything, with no dismiss control on purpose: dismissal is client state,
 * and a block is a server component — the demo's one client piece lives inside FaqAccordion,
 * a child of a server root, and a bar this small earns no such child. When it links, the
 * whole line is the link, underlined so hue is never the only signal.
 */
export function AnnouncementBar({ text, href, tone }: AnnouncementBarProps) {
  return (
    <aside
      data-nubbin-block="AnnouncementBar"
      aria-label="Announcement"
      className={`${TONE_STYLES[tone]} px-6 py-2.5 text-center text-sm font-semibold`}
    >
      {href === undefined ? (
        <p>{text}</p>
      ) : (
        <a href={href} className="underline underline-offset-4">
          {text}
        </a>
      )}
    </aside>
  );
}
