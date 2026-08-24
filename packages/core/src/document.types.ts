import type { UnknownProps } from "./block.types";

/**
 * What a page says about itself. `compile` copies it into the artifact unchanged and Nubbin
 * renders none of it — a framework binding decides what becomes a `<title>` or a meta tag.
 */
export interface DocumentMeta {
  /** The page's title. The one required field: every page is named, in an editor as much as in a tab. */
  title: string;
  /** The page's description, for a meta tag. */
  description?: string;
  /** A robots directive, verbatim — `noindex`, `noindex, nofollow`. Absent leaves it to the app's default. */
  robots?: string;
  /** The page's canonical URL, absolute. `@nubbin/next` puts it where Next reads one. */
  canonical?: string;
}

// The authoring shape: children are id references, so every editor operation is by id.
/**
 * One element of a document: which block renders it, the props an author has typed, and the ids
 * of what sits in each of its slots.
 *
 * @example
 * ```ts
 * const section: Node = {
 *   id: crypto.randomUUID(),
 *   block: "Hero",
 *   props: { title: "Summer promotion", price: 10 },
 *   slots: { items: ["card-1", "card-2"] },
 * };
 * ```
 */
export interface Node {
  /**
   * Unique within the document, and the handle every operation takes. The caller mints it —
   * `core` reaches no `crypto` builtin, and a generator inside these functions would make one
   * composition produce a different document each time, which content addressing cannot tolerate.
   */
  id: string;
  /** The `name` of a registered block. `compile` refuses a name neither the registry nor the catalog holds. */
  block: string;
  /**
   * What the author typed, unvalidated. `compile` runs it through the block's schema and keeps
   * what `validate()` returned — a coercion, a transform or a `.default()` reaches the artifact
   * in its parsed form, and a key the schema did not keep is reported as `unknown-prop`.
   */
  props: UnknownProps;
  /**
   * Slot name → ordered child ids. Order is the render order. An absent slot holds zero
   * children, which a `min` of 1 or more refuses.
   */
  slots?: Record<string, readonly string[]>;
}

/**
 * One version of a page's composition — the input to `compile`, and what an editing session
 * reads and rewrites. Flat by design: `elements` is an index keyed by id and a node's slots hold
 * child ids, so every operation addresses a node directly rather than walking a tree to reach it.
 *
 * `setNodeProp`, `addNode`, `removeNode` and `moveNode` each return a new one, copy-on-write,
 * with every untouched node kept by reference. None of them bumps `version`.
 *
 * @example
 * ```ts
 * const version: DocumentVersion = {
 *   documentId: "d1",
 *   version: 1,
 *   roots: ["n1"],
 *   elements: {
 *     n1: { id: "n1", block: "Hero", props: { title: "T" }, slots: { items: ["n2"] } },
 *     n2: { id: "n2", block: "Card", props: { label: "L" } },
 *   },
 *   meta: { title: "Summer promotion" },
 *   createdAt: "2026-01-01T00:00:00Z",
 *   createdBy: "studio",
 * };
 * ```
 */
export interface DocumentVersion {
  /** The page this is a version of, stable across every version of it. Stamped into the artifact. */
  documentId: string;
  /** Which version of that page. Appending a version belongs to the authoring store, not to one edit. */
  version: number;
  /**
   * Ordered entry elements — the artifact's tree is these, denormalized, in this order. An id
   * with no element behind it is a `dangling-child`, and an empty list is `no-roots`. See
   * [A document has many roots](https://github.com/effekt/nubbin/blob/main/docs/decisions/a-document-has-many-roots.md).
   */
  roots: readonly string[];
  /**
   * Every node in the document, keyed by its own `id`. A node no slot and no root reaches is
   * `unreachable`, which `compile` refuses rather than dropping in silence.
   */
  elements: Record<string, Node>;
  /** What the page says about itself. Copied into the artifact unchanged. */
  meta: DocumentMeta;
  /** When this version was authored, as an ISO 8601 timestamp. Not carried into the artifact. */
  createdAt: string;
  /**
   * Who authored it, in whatever identity the consumer's authoring surface uses. Not carried
   * into the artifact either — both fields describe the draft, not the published page.
   */
  createdBy: string;
}
