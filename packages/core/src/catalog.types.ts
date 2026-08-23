import type { UnknownProps } from "./block.types";

/** How a field's value resolves at render. Absent means static — the value freezes into props. */
export type FieldHintData = { revalidate: number };

/**
 * Studio treatment for one schema path. Open by design: a consumer may carry keys core does not
 * read, and core reads exactly one — how the field resolves.
 */
export interface FieldHint {
  data?: FieldHintData;
}

export interface BlockUi {
  /** Keyed by schema path (`title`, `cta.label`, `items[].icon`). Unresolvable paths fail registration. */
  fields?: Record<string, FieldHint>;
}

/** Serializable data only — what the studio and CI read. Components live in the registry. */
export interface CatalogEntry {
  schema: unknown;
  ui?: BlockUi;
  defaults?: UnknownProps;
}

export type Catalog = Record<string, CatalogEntry>;
