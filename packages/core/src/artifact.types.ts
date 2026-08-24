import type { UnknownProps } from "./block.types";
import type { FieldHintData } from "./catalog.types";
import type { DocumentMeta, Node } from "./document.types";

// Field path → how the field resolves at render.

/**
 * The fields on one node that the renderer resolves rather than reads, keyed by the dotted
 * schema path the block's `ui.fields` hint named. The value carries how the field resolves;
 * where it resolves from is the rendering adapter's business.
 *
 * @example
 * ```ts
 * const holes: Holes = { "cta.label": { revalidate: 60 } };
 * ```
 */
export type Holes = Record<string, FieldHintData>;

/** Per-node validation and partitioning, injected into `denormalize` so the walk stays pure. */
export type ResolveNode = (node: Node) => { props: UnknownProps; holes: Holes };

// Resolved — no lookups, no dangling references possible.

/**
 * One node of a compiled tree. Children are the nodes themselves, so a renderer walks the tree
 * without resolving an id against anything.
 *
 * @example
 * ```tsx
 * function render(node: ArtifactNode) {
 *   const Block = components[node.block];
 *   const children = Object.values(node.slots ?? {}).flat().map(render);
 *   return <Block {...node.props}>{children}</Block>;
 * }
 * ```
 */
export interface ArtifactNode {
  /** The id of the document element this was compiled from — stable across recompiles. */
  id: string;
  /** The block's registered name. Look it up in the registry to find the component. */
  block: string;
  // Frozen fields only — literal values.
  /**
   * The props as compiled: literal values only, already validated against the block's schema.
   * A field listed in `holes` is absent here.
   */
  props: UnknownProps;
  /** The fields left for the renderer to resolve. Absent when the node has none. */
  holes?: Holes;
  /**
   * Slot name → the nodes filling it, in order. Absent when the document element declared no
   * slots; a declared slot with nothing in it is an empty array.
   */
  slots?: Record<string, ArtifactNode[]>;
}

// The compiled result of one document version. Immutable and content-addressed.

/**
 * One route's page, compiled and ready to render or store. Nothing mutates it — publishing a
 * change compiles a new artifact and moves the route's pointer at it, so a hash that resolves
 * once resolves to the same bytes forever.
 *
 * @example
 * ```ts
 * const { artifact } = compile(version, catalog, registry, "/pricing");
 * await store.write(artifact);
 * await store.publish(artifact.route, artifact.hash);
 * ```
 */
export interface Artifact {
  // Content address — the identity.
  /**
   * The content address, and the name to read it back by. It is computed over every other field
   * with object keys sorted first, so identical content lands at the same address however the
   * compile happened to order it.
   */
  hash: string;
  /**
   * The route this was compiled for. The CLI refuses to roll a route back to an artifact
   * carrying a different one, however plausible the hash looks.
   */
  route: string;
  /** The document this is a compilation of. */
  documentId: string;
  /** Which version of that document — the number on the `DocumentVersion` that was compiled. */
  documentVersion: number;
  // What this was compiled against — only the blocks the document uses.
  /**
   * Block name → the version registered when this compiled, for the blocks the document uses and
   * no others. `checkRollback` and `checkCompatibility` compare it against a live registry.
   */
  blockVersions: Record<string, number>;
  /** One tree per entry element, in the order the document version's `roots` names them. */
  tree: ArtifactNode[];
  /** The document's metadata, carried through unchanged — the head a renderer emits. */
  meta: DocumentMeta;
  /** The `@nubbin/core` version that compiled it. */
  compiledWith: string;
}

// The only mutable state in the output layer — one independently-writable record per route.

/**
 * What a route currently serves. This is the one record that changes in place: publishing,
 * rolling back and unpublishing all move or remove a pointer, and touch nothing else.
 *
 * @example
 * ```ts
 * const pointer = await store.pointer("/pricing");
 * const artifact = pointer === null ? null : await store.read(pointer.hash);
 * ```
 */
export interface RoutePointer {
  /** The route served, exactly as it was published. */
  route: string;
  /** How a request matches the route — derived from it by `parseMatchKind`, never supplied. */
  matchKind: "exact" | "param" | "prefix";
  // Artifact currently live at this route.
  /** The hash of the artifact serving this route right now. */
  hash: string;
  /** When the pointer last moved, as an ISO-8601 timestamp. */
  updatedAt: string;
}

// Advisory aggregation over every pointer, for the studio's route list and CI.

/**
 * Every route pointer a store holds, gathered in one value — the route list an editing surface
 * or a CI check reads. Derived on each call, so it is a snapshot rather than a stored document
 * anything else depends on.
 *
 * @example
 * ```ts
 * const { routes } = await store.manifest();
 * console.log(routes.map((pointer) => `${pointer.route} -> ${pointer.hash}`).join("\n"));
 * ```
 */
export interface Manifest {
  /** One pointer per published route, in no guaranteed order. */
  routes: RoutePointer[];
  /** When this snapshot was taken, as an ISO-8601 timestamp. */
  generatedAt: string;
}

/** One pointer move, recorded by `publish` — only published states, so rollback can trust it. */
export interface PointerMove {
  /** What the route was pointed at. */
  hash: string;
  /** The document version that compiled to that hash — what a rollback resolves by. */
  documentVersion: number;
  /** When the pointer moved, as an ISO-8601 timestamp. */
  movedAt: string;
}

// The output layer's whole IO surface. Adapters implement it; core only returns values for it.

/**
 * The storage contract behind publishing: implement it over Postgres, S3, or anything else, and
 * every part of Nubbin that publishes, rolls back or checks routes works against it. Two kinds of
 * state sit behind it — artifacts keyed by content hash, written once and never changed, and one
 * pointer per route, which is the only thing that moves.
 *
 * Callers order the two: `write` the artifact, then `publish` the route at its hash. An
 * implementation holds up its half by making absence a value rather than a failure, by taking a
 * repeated `write` as a no-op and a repeated `publish` as an ordinary one so a retried publish
 * succeeds, and by writing each pointer whole — two publishes racing for one route must leave one
 * of them intact, never a blend. `@nubbin/store-fs` is the reference implementation, and
 * `packages/store-fs/src/testing/runArtifactStoreContract.ts` is the suite every implementation
 * is expected to pass.
 *
 * @example
 * ```ts
 * import { parseMatchKind } from "@nubbin/core";
 * import type { ArtifactStore } from "@nubbin/core";
 *
 * const store: ArtifactStore = {
 *   read: async (hash) => (await db.artifact(hash)) ?? null,
 *   write: async (artifact) => { await db.putArtifactIfAbsent(artifact.hash, artifact); },
 *   manifest: async () => ({ routes: await db.pointers(), generatedAt: new Date().toISOString() }),
 *   pointer: async (route) => (await db.pointer(route)) ?? null,
 *   publish: async (route, hash) => { await db.movePointer(route, hash, parseMatchKind(route)); },
 *   unpublish: async (route) => { await db.deletePointer(route); },
 * };
 * ```
 */
export interface ArtifactStore {
  /**
   * Reads one artifact by its content hash.
   *
   * @param hash - The `hash` of an artifact already written.
   * @returns The artifact as written, or `null` when the store holds nothing at that hash.
   * Absence is a value here — an unknown hash never throws.
   * @example
   * ```ts
   * const artifact = await store.read("4a162726");
   * ```
   */
  read(hash: string): Promise<Artifact | null>;

  /**
   * Stores one artifact under its own hash. Write before publishing the route at it.
   *
   * @param artifact - A compiled artifact. `artifact.hash` is the key; nothing else is read.
   * @returns Nothing. Writing a hash the store already holds is a no-op, so a publish retried
   * after a timeout succeeds on its second attempt.
   * @throws Whatever the underlying storage raises when the write itself fails.
   * @example
   * ```ts
   * await store.write(compile(version, catalog, registry, "/pricing").artifact);
   * ```
   */
  write(artifact: Artifact): Promise<void>;

  /**
   * Lists every published route.
   *
   * @returns A snapshot of every pointer the store holds, with the time it was taken. An empty
   * `routes` is a store with nothing published, not a failure.
   * @example
   * ```ts
   * const { routes } = await store.manifest();
   * ```
   */
  manifest(): Promise<Manifest>;

  /**
   * Reads the pointer for one route.
   *
   * @param route - The route as it was published, matched exactly — `/pricing` does not find
   * `/pricing/`, and a `param` or `prefix` pointer is found by its pattern, not by a path it
   * would match.
   * @returns The pointer, or `null` when nothing is published at that route.
   * @example
   * ```ts
   * const pointer = await store.pointer("/guides/[city]");
   * ```
   */
  pointer(route: string): Promise<RoutePointer | null>;

  /**
   * Points a route at an artifact already in the store — the publish, and the rollback. The
   * implementation derives `matchKind` with `parseMatchKind` and stamps `updatedAt` itself.
   *
   * @param route - The route to serve. It is validated on the way through `parseMatchKind`.
   * @param hash - The artifact to serve there. It has to be written first.
   * @returns Nothing. Publishing the same route and hash twice succeeds and leaves the route
   *   where it already pointed, which is what makes a retry safe — it is not a no-op. The pointer
   *   is rewritten and a store keeping history records a second move, since what is deduplicated
   *   is the artifact rather than the act of publishing.
   * @throws NubbinError with `code` `NubbinIssueCode.InvalidRoute` when the route is not
   * addressable, from `parseMatchKind`. An implementation also rejects a hash it holds no
   * artifact for, so no pointer can name one that was never written — `@nubbin/store-fs` refuses
   * that with `NubbinIssueCode.ArtifactNotStored`.
   * @example
   * ```ts
   * await store.write(artifact);
   * await store.publish("/pricing", artifact.hash);
   * ```
   */
  publish(route: string, hash: string): Promise<void>;

  /**
   * Takes a route offline by removing its pointer. The artifact stays, so republishing it is
   * another `publish` at the same hash.
   *
   * @param route - The route to stop serving.
   * @returns Nothing. Unpublishing a route that has no pointer is a no-op.
   * @example
   * ```ts
   * await store.unpublish("/pricing");
   * ```
   */
  unpublish(route: string): Promise<void>;
  /**
   * Every move `publish` made at this route, oldest first, surviving `unpublish`. Optional
   * because a write-only blob store is still a valid adapter — a caller degrades with a
   * message rather than requiring it.
   *
   * @param route - The route whose moves are read.
   * @returns One entry per publish, oldest first, and an empty array for a route that has never
   *   been published. A store that keeps no history omits the method rather than returning `[]`,
   *   so a caller can tell "never published" from "not recorded".
   * @example
   * ```ts
   * const moves = (await store.history?.("/pricing")) ?? [];
   * moves.at(-1)?.hash; // what it points at now
   * ```
   */
  history?(route: string): Promise<PointerMove[]>;
}
