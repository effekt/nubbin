/** The canvas's marked degraded state for a block whose current values break its component —
 * the wireframes' missing-from-the-registry placeholder, worn by a throwing render. A draft
 * may legitimately hold invalid values, so the block marks itself and the page renders on
 * around it. The signal is a dashed bad-tone border, the glyph and the words together —
 * never a hue alone — and the element carries no handler of its own, so a click bubbles to
 * Puck's node wrapper and selects the block, landing the author where the inspector shows
 * the bad value. The `hint` line defaults to the canvas's fix path; the preview route,
 * where there are no fields to fix, hands its own. */
export function BrokenBlock({
  name,
  hint = "Fix the fields, or remove the block.",
}: {
  name: string;
  hint?: string;
}) {
  return (
    <div
      data-nubbin-broken={name}
      className="border-2 border-dashed border-orange-deep bg-canvas px-6 py-8 text-marine"
    >
      <p className="font-semibold">
        <span aria-hidden="true">⚠ </span>
        {`${name} can’t render — its current values break it.`}
      </p>
      <p className="mt-1 text-marine/70">{hint}</p>
    </div>
  );
}
