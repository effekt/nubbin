import studioConfig from "@nubbin/studio-config";
import { listDraftRoutes } from "./listDraftRoutes";

/** Every route the editor can open: configured seed documents plus any page created in the
 * studio, which exists only as a draft file. One route appears once — an edited fixture
 * has both a fixture and a draft — and the list is sorted so the switcher reads stably
 * across reloads. */
export function listEditableRoutes(): readonly string[] {
  return [...new Set([...Object.keys(studioConfig.seedDocuments), ...listDraftRoutes()])].sort();
}
