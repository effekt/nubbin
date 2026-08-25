import type { Config, SlotField } from "@measured/puck";
import type { SlotConstraint } from "@nubbin/core";

/** Puck-specific config derivation kept behind an optional client-renderer entry. */
export const puckAdapter = {
  rootConfig: (): NonNullable<Config["root"]> => ({
    fields: {
      title: { type: "text", label: "Title" },
      description: { type: "textarea", label: "Description" },
      robots: { type: "text", label: "Robots" },
      canonical: { type: "text", label: "Canonical URL" },
    },
  }),
  slotField: (constraint: SlotConstraint): SlotField => {
    const field: SlotField = { type: "slot" };
    if (constraint.allow !== undefined) field.allow = [...constraint.allow];
    return field;
  },
} as const;
