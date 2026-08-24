import type { Artifact } from "./artifact.types";
import { assertValidRoute } from "./assertValidRoute";
import type { Catalog } from "./catalog.types";
import type { CompileResult } from "./compileResult.types";
import { denormalize } from "./denormalize";
import type { DocumentVersion } from "./document.types";
import { hashArtifact } from "./hashArtifact";
import { NubbinError } from "./NubbinError";
import type { Registry } from "./registry.types";
import { resolveAllProps } from "./resolveAllProps";
import { usedBlockVersions } from "./usedBlockVersions";
import { validateStructure } from "./validateStructure";
import { NUBBIN_VERSION } from "./version.constants";

// Orchestration only. Structure first, and stop there if it failed — prop validation on a
// document with dangling references produces cascading noise that buries the real cause.
//
// The route is judged before any of it, because it is baked into the artifact and into the
// content address: an unaddressable route would otherwise compile, hash, and store cleanly, and
// only fail to match a request once it was live.
/**
 * Validates one document version and serializes it into an immutable, content-addressed
 * {@link Artifact}. It reads nothing and writes nothing — fetching the document and storing the
 * artifact belong to an adapter.
 *
 * Two passes, each collecting rather than stopping at the first fault. Structure comes first:
 * every node names a registered block, every child id resolves, the graph flattens from `roots`
 * without cycles, and every filled slot is declared and inside its `allow`, `min` and `max`.
 * Props come second, each node's values run through its catalog entry's own schema. The second
 * pass runs only when the first found nothing.
 *
 * Compiling the same document against the same catalog and registry yields the same
 * `artifact.hash` every time — key order is normalized before hashing, so an insertion order
 * cannot change the address.
 *
 * @param version - The document to compile. `roots` names the entry elements in order and
 *   `elements` indexes every node by id. Both are read, neither is mutated.
 * @param catalog - The serializable half of registration, keyed by block name: the schema each
 *   node's props are judged by, and the `ui.fields` hints deciding which fields freeze into the
 *   artifact and which become holes filled at render. A block a node names and the catalog omits
 *   is a fault.
 * @param registry - The registered blocks, keyed by name. It supplies the slot constraints the
 *   structural pass judges against, and the version number each used block is stamped with in
 *   `artifact.blockVersions`.
 * @param route - Where the artifact is published. It is baked into the artifact and into the
 *   content address, and it is judged before the document is looked at: absolute, no trailing
 *   slash unless it is `/` itself, `[slug]` for a param segment, and `*` only as the final
 *   segment.
 *
 * @returns The artifact, and the issues that did not stop one existing. A key an author wrote
 *   and the schema did not keep comes back as `unknown-prop`, naming the node and the dotted
 *   path — the artifact is publishable either way, so logging it, shipping it or ignoring it is
 *   the caller's call.
 *
 * @throws {NubbinError} A `NubbinError` coded `invalid-route` when `route` addresses no page,
 *   raised before anything in the document is read.
 * @throws {NubbinError} One `NubbinError` carrying every structural fault at once, in `issues`:
 *   `no-roots`, `unknown-block`, `dangling-child`, `cycle`, `unreachable`, `slot-not-allowed`,
 *   `slot-min`, `slot-max`.
 * @throws {NubbinError} One `NubbinError` carrying every prop fault at once: `invalid-props` for
 *   a value a schema rejects or one that parses to something other than an object, and
 *   `unknown-block` for a node whose block has no catalog entry.
 * @throws {NubbinError} A `NubbinError` coded `not-standard-schema` when a catalog entry's schema
 *   exposes no `~standard.validate`, or answers with a promise — compiling is synchronous.
 *
 * @example Compile a document and store what comes back
 * ```ts
 * import { compile, createRegistry, defineBlock, defineCatalog } from "@nubbin/core";
 * import type { DocumentVersion } from "@nubbin/core";
 * import { z } from "zod";
 *
 * const heroSchema = z.object({ title: z.string(), price: z.number() });
 * const hero = defineBlock({
 *   name: "Hero",
 *   schema: heroSchema,
 *   component: null,
 *   version: 1,
 *   slots: {},
 * });
 *
 * const registry = createRegistry([hero]);
 * const catalog = defineCatalog({
 *   Hero: { schema: heroSchema, ui: { fields: { price: { data: { revalidate: 60 } } } } },
 * });
 *
 * const version: DocumentVersion = {
 *   documentId: "d1",
 *   version: 1,
 *   roots: ["n1"],
 *   elements: { n1: { id: "n1", block: "Hero", props: { title: "T", price: 10 } } },
 *   meta: { title: "Summer promotion" },
 *   createdAt: "2026-01-01T00:00:00Z",
 *   createdBy: "studio",
 * };
 *
 * const { artifact, issues } = compile(version, catalog, registry, "/promotions/summer");
 *
 * artifact.tree[0]?.props;  // { title: "T" } — frozen into the artifact
 * artifact.tree[0]?.holes;  // { price: { revalidate: 60 } } — resolved at render instead
 * artifact.blockVersions;   // { Hero: 1 }
 * issues;                   // [] — nothing the schema dropped
 * ```
 *
 * @example Branch on a refusal rather than reading its prose
 * ```ts
 * import { NubbinError, NubbinIssueCode } from "@nubbin/core";
 *
 * try {
 *   const { artifact } = compile(version, catalog, registry, route);
 *   await store.write(artifact);
 * } catch (error) {
 *   if (!(error instanceof NubbinError)) throw error;
 *   if (error.code === NubbinIssueCode.InvalidRoute) return rejectRoute(error.message);
 *   for (const issue of error.issues) editor.mark(issue.at, issue.path, issue.message);
 * }
 * ```
 */
export function compile(
  version: DocumentVersion,
  catalog: Catalog,
  registry: Registry,
  route: string,
): CompileResult {
  assertValidRoute(route);
  const structural = validateStructure(version, registry);
  if (structural.length > 0) throw new NubbinError(structural);

  const { resolved, issues, reported } = resolveAllProps(version, catalog);
  if (issues.length > 0) throw new NubbinError(issues);

  // Every element resolved or an issue was thrown above; the fallback is unreachable.
  const tree = denormalize(version, (node) => resolved.get(node.id) ?? { props: {}, holes: {} });

  const content: Omit<Artifact, "hash"> = {
    route,
    documentId: version.documentId,
    documentVersion: version.version,
    blockVersions: usedBlockVersions(version, registry),
    tree,
    meta: version.meta,
    compiledWith: NUBBIN_VERSION,
  };
  return { artifact: { ...content, hash: hashArtifact(content) }, issues: reported };
}
