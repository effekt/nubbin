"use client";

/** The inspector's quiet last line: the one reassurance an
 * author needs while editing — nothing here has a save button. It states only what the
 * draft flow proves: edits save on a debounce, and the preview reads the saved draft. */
export function InspectorFoot() {
  return (
    <p className="nb-insp-foot">
      Changes save by themselves — Preview shows the latest saved edits.
    </p>
  );
}
