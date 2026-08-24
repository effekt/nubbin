import type { DocumentVersion } from "@nubbin/core";
import { fromPuckData } from "./fromPuckData";
import type { PuckData } from "./puckData.types";
import { toPuckData } from "./toPuckData";

/** What one editor change folds down to: the draft to save, and the `Data` the controlled
 * editor holds next. */
export interface FoldedPuckChange {
  version: DocumentVersion;
  data: PuckData;
}

/** One Puck `onChange` folded back into a Nubbin draft. When nothing was created the
 * editor keeps Puck's own `Data` untouched — no churn mid-keystroke — but a node Puck
 * created gets a minted id, so the returned `data` is then re-derived from the folded
 * version and the controlled editor holds the minted id thereafter, exactly as the
 * adapter promises. */
export function foldPuckChange(
  data: PuckData,
  prior: DocumentVersion,
  blockSlots: Record<string, readonly string[]>,
): FoldedPuckChange {
  let minted = false;
  const mintId = () => {
    minted = true;
    return crypto.randomUUID();
  };
  const version = fromPuckData(data, prior, mintId, blockSlots);
  return { version, data: minted ? toPuckData(version) : data };
}
