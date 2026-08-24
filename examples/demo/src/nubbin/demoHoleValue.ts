import type { NowPayload } from "./nowPayload.types";
import { plural } from "./plural";
import { timeOfDay } from "./timeOfDay";

/**
 * Shapes one payload into what the field's schema describes. Nothing validates a hole's value at
 * render — `resolveNodeHoles` sets it and the block reads it — so this shape is owed here, and
 * the sibling test against the real schemas is the only thing that checks it is paid.
 *
 * Every value here is derived from the payload rather than invented, so a second request a
 * second later disagrees with the first. That disagreement is the point: a field that could be
 * frozen at publish would not need a hole.
 */
export function demoHoleValue(block: string, path: string, payload: NowPayload): unknown {
  const at = timeOfDay(payload.now);
  if (block === "LiveBand" && path === "items") {
    return [
      { text: `The estuary has been read ${payload.served} ${plural(payload.served, "time")}`, at },
      { text: "Ferry holding to the winter timetable", at },
    ];
  }
  if (block === "UpdateFeed" && path === "entries") {
    return [
      { text: "This feed resolved for the request you just made", at },
      {
        text: `Answered ${payload.served} ${plural(payload.served, "time")} since the server started`,
        at,
      },
    ];
  }
  if (block === "FaqAccordion" && path === "items") {
    return [
      { question: "When was this answer cached?", answer: new Date(payload.now).toISOString() },
    ];
  }
  throw new Error(`no demo resolver for ${block}.${path}`);
}
