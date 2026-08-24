/** The inspector's scrolling body — the region `FieldsWithCallout` wraps Puck's field list
 * in, and the scope a field search must stay inside so it never matches the canvas. Falls
 * back to the document's body when the inspector is not mounted, which degrades to a wider
 * search rather than a crash. */
export function inspectorBody(doc: Document): ParentNode {
  return doc.querySelector(".nb-insp-body") ?? doc.body;
}
