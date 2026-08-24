import type { DocumentVersion, Node } from "@nubbin/core";
import { isPuckSlotValue } from "./isPuckSlotValue";
import type { PuckComponentData } from "./puckData.types";

/** What one flattening walk carries: the draft the edit started from, the `elements` map being
 * rebuilt, and the id mint for nodes Puck created. */
export interface FromPuckContext {
  prior: DocumentVersion;
  elements: Record<string, Node>;
  mintId: () => string;
}

/** Flattens one Puck component back into `ctx.elements` and returns the id it landed under.
 * An id the prior draft holds passes through unchanged; one Puck created is replaced by a
 * fresh minted id, which is what the controlled editor holds thereafter. A non-empty array of
 * components becomes a slot; an empty array is a slot only when the prior node held that key
 * as one, since `[]` is also a legal ordinary prop. */
export function fromPuckComponent(component: PuckComponentData, ctx: FromPuckContext): string {
  const { id: puckId, ...rest } = component.props;
  const priorNode = ctx.prior.elements[puckId];
  const id = priorNode === undefined ? ctx.mintId() : puckId;
  const props: Record<string, unknown> = {};
  const slots: Record<string, readonly string[]> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (isPuckSlotValue(value)) {
      slots[key] = value.map((child) => fromPuckComponent(child, ctx));
    } else if (Array.isArray(value) && value.length === 0 && priorNode?.slots?.[key]) {
      slots[key] = [];
    } else {
      props[key] = value;
    }
  }
  const node: Node = { id, block: component.type, props };
  if (Object.keys(slots).length > 0) node.slots = slots;
  ctx.elements[id] = node;
  return id;
}
