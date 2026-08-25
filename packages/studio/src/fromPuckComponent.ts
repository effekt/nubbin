import type { DocumentVersion, Node } from "@nubbin/core";
import { isSlotEntry } from "./isSlotEntry";
import type { PuckComponentData } from "./puckData.types";
import { toPuckChildren } from "./toPuckChildren";

/** What one flattening walk carries: the draft the edit started from, the `elements` map being
 * rebuilt, the id mint for nodes Puck created, and — when the caller derived them from the
 * registry — each block's declared slot names, so a slot is told from a prop by schema rather
 * than by shape. */
export interface FromPuckContext {
  prior: DocumentVersion;
  elements: Record<string, Node>;
  mintId: () => string;
  blockSlots?: Record<string, readonly string[]> | undefined;
}

/** Flattens one Puck component back into `ctx.elements` and returns the id it landed under.
 * An id the prior draft holds passes through unchanged; one Puck created is replaced by a
 * fresh minted id, which is what the controlled editor holds thereafter. `isSlotEntry`
 * settles which props are slots — by declared name when `ctx.blockSlots` covers the block,
 * structurally otherwise. */
export function fromPuckComponent(component: PuckComponentData, ctx: FromPuckContext): string {
  const { id: puckId, ...rest } = component.props;
  const priorNode = ctx.prior.elements[puckId];
  const id = priorNode === undefined ? ctx.mintId() : puckId;
  const declaredSlots = ctx.blockSlots?.[component.type];
  const props: Record<string, unknown> = {};
  const slots: Record<string, readonly string[]> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (isSlotEntry(key, value, priorNode, declaredSlots)) {
      slots[key] = toPuckChildren(value).map((child) => fromPuckComponent(child, ctx));
    } else {
      props[key] = value;
    }
  }
  const node: Node = { id, block: component.type, props };
  if (Object.keys(slots).length > 0) node.slots = slots;
  ctx.elements[id] = node;
  return id;
}
