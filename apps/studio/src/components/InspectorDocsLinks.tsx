"use client";

import { toDocsLinkLabel } from "../nubbin/toDocsLinkLabel";
import "./inspectorDocs.css";

/** The selected block's docs links, one "Open in {Key}" anchor per entry, in a new tab. The
 * keys are opaque — the consumer supplied them and the URLs, and the studio renders exactly
 * what it was given, holding no opinion about what is behind a link. */
export function InspectorDocsLinks({ docs }: { docs: Record<string, string> }) {
  return (
    <nav className="nubbin-inspector-docs" aria-label="Block documentation">
      {Object.entries(docs).map(([key, url]) => (
        <a key={key} href={url} target="_blank" rel="noreferrer">
          {toDocsLinkLabel(key)} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
