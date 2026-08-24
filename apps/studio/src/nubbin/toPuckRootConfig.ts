import type { Config } from "@measured/puck";

/** The Puck config for the document root — the Page panel, shown when nothing is selected.
 * One field per `DocumentMeta` key, so the panel edits the whole head rather than the title
 * Puck's default root exposes alone. `robots` and `canonical` stay plain text because the
 * contract carries both verbatim; an emptied optional field folds back to absent through
 * `toDocumentMeta`, never to an empty string in the draft. */
export function toPuckRootConfig(): NonNullable<Config["root"]> {
  return {
    fields: {
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      robots: { type: "text", label: "Robots" },
      canonical: { type: "text", label: "Canonical URL" },
    },
  };
}
