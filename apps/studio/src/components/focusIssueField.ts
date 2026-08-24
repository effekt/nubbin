import { fieldPathPrefixes } from "../nubbin/fieldPathPrefixes";
import { findDeepestFieldElement } from "./findDeepestFieldElement";
import { focusFieldElement } from "./focusFieldElement";
import { openRepeaterRowFor } from "./openRepeaterRowFor";
import { pollFrames } from "./pollFrames";

/**
 * Finishes the journey an issue row starts: after the node is selected, waits for Puck's
 * inspector to render its fields, then lands focus on the control the issue's path names —
 * the wireframes' rule that the fix is one keystroke away. A leaf inside a collapsed
 * repeater row is reached by opening the row it descends into and looking again; a path
 * the DOM cannot address at all degrades silently to the selection the caller already
 * made. Answers with the path prefix that took focus, or `undefined` for none.
 */
export async function focusIssueField(
  region: ParentNode,
  nodeId: string,
  path: string | undefined,
  frames = 30,
): Promise<string | undefined> {
  if (path === undefined) {
    return undefined;
  }
  const prefixes = fieldPathPrefixes(path);
  let found = await pollFrames(() => findDeepestFieldElement(region, nodeId, prefixes), frames);
  while (found !== undefined && found.path !== path) {
    const landing = found;
    const disclose = openRepeaterRowFor(landing, path);
    if (disclose === undefined) {
      break;
    }
    const deeper = prefixes.slice(0, prefixes.indexOf(landing.path));
    const next = await pollFrames(() => findDeepestFieldElement(region, nodeId, deeper), frames);
    if (next === undefined) {
      focusFieldElement(disclose);
      return landing.path;
    }
    found = next;
  }
  if (found === undefined) {
    return undefined;
  }
  focusFieldElement(found.element);
  return found.path;
}
