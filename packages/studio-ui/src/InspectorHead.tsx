"use client";

import { usePuck } from "@measured/puck";
import { PaletteIcon } from "./PaletteIcon";
import { parseZoneCompound } from "./parseZoneCompound";
import { toAreaLabel } from "./toAreaLabel";
import { toPositionLine } from "./toPositionLine";

/** Puck's own id for the document root in a zone compound. */
const ROOT_PARENT_ID = "root";

interface InspectorHeadProps {
  /** Each block's icon name by block name — the palette's glyphs, so the head matches. */
  // `| undefined` so the wrapper's own optional prop assigns under `exactOptionalPropertyTypes`.
  icons?: Record<string, string> | undefined;
}

/** The inspector's head, from the specimen: the selected block's glyph in a warm tile, its
 * name, and where it sits — `2nd block in Page body` — read straight from Puck's selector
 * for the node, so the line is never guessed. With nothing selected the panel edits the
 * page itself, and the head says so without inventing a position. */
export function InspectorHead({ icons }: InspectorHeadProps) {
  const { selectedItem, getSelectorForId, getItemById } = usePuck();
  if (selectedItem == null) {
    return (
      <header className="nb-insp-head">
        <div className="nb-insp-head-name">
          <h2>Page</h2>
          <p>Title and metadata</p>
        </div>
      </header>
    );
  }
  const icon = icons?.[selectedItem.type];
  const selector = getSelectorForId(selectedItem.props.id);
  let position: string | undefined;
  if (selector !== undefined) {
    const { parentId, slot } = parseZoneCompound(selector.zone);
    const parentType = parentId === ROOT_PARENT_ID ? undefined : getItemById(parentId)?.type;
    if (parentId === ROOT_PARENT_ID || parentType !== undefined) {
      position = toPositionLine(selector.index, toAreaLabel(parentType, slot));
    }
  }
  return (
    <header className="nb-insp-head">
      {icon !== undefined ? (
        <span className="nb-insp-head-icon" aria-hidden="true">
          <PaletteIcon icon={icon} />
        </span>
      ) : null}
      <div className="nb-insp-head-name">
        <h2>{selectedItem.type}</h2>
        {position !== undefined ? <p>{position}</p> : null}
      </div>
    </header>
  );
}
