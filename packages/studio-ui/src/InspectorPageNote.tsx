"use client";

/** The quiet line above the Page panel's fields while nothing is selected: what
 * these fields are, so an author knows the panel edits the page's own head rather than any
 * block. Static prose, not a status — it neither appears nor changes as the author works. */
export function InspectorPageNote() {
  return (
    <p className="nb-insp-page-note">
      These fields describe the page itself — the title a tab shows, and the description, robots
      directive and canonical URL its head carries. A field left empty publishes as absent.
    </p>
  );
}
