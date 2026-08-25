import type { DocumentVersion } from "@nubbin/core";
import type { PuckData } from "./puckData.types";
import { toPuckComponent } from "./toPuckComponent";

/** A Nubbin draft as Puck's `Data`: each root becomes a top-level component in `roots` order,
 * children nested inline through `toPuckComponent`, and the document's meta becomes
 * `root.props`. The inverse is `fromPuckData`, and nothing else in the studio translates
 * between the two shapes. */
export function toPuckData(version: DocumentVersion): PuckData {
  return {
    content: version.roots.map((root) => toPuckComponent(root, version.elements)),
    root: { props: { ...version.meta } },
  };
}
