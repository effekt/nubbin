import type { Artifact, ArtifactStore, RoutePointer } from "@nubbin/core";
import { artifactPath } from "./artifactPath";
import { fsHistory } from "./fsHistory";
import { fsManifest } from "./fsManifest";
import { fsPublish } from "./fsPublish";
import { fsUnpublish } from "./fsUnpublish";
import { fsWriteArtifact } from "./fsWriteArtifact";
import { pointerPath } from "./pointerPath";
import { readJsonOrNull } from "./readJsonOrNull";

// One pointer file per route, one file per artifact, one append-only log per route. No aggregate
// document exists, so two publishes to different routes cannot lose each other's write.
//
// Each whole-file write is temp-then-rename and the log is appended a line at a time, so no path
// here reads a shared file back to rewrite it — which is the operation racing writers lose work
// to.
/**
 * Builds the reference `ArtifactStore` over a directory — the store the studio, the example app
 * and the documented `@nubbin/cli` setup all publish through, and the one a replacement adapter is
 * measured against.
 *
 * Three kinds of file live under `root`, and nothing else does:
 *
 * ```text
 * <root>/
 *   artifacts/<hash>.json                 one per written artifact, never rewritten
 *   routes/%2Fpromotions%2Fsummer.json    the pointer — the only file that moves
 *   history/%2Fpromotions%2Fsummer.jsonl  one line per publish, oldest first
 * ```
 *
 * A route key is percent-encoded, so a route with slashes is one flat filename rather than a
 * directory tree, and `manifest()` can list `routes/` to find every published route. The logs sit
 * in their own directory for that reason: a `.jsonl` filed among the pointers would be read as one
 * and break the listing.
 *
 * Nothing is created until something is written — `root` need not exist, and each write makes the
 * directory it needs. Reading before then is not a failure: an unknown hash and an unpublished
 * route both read as `null`, and a store with no `routes/` yet manifests as no routes.
 *
 * Repeating a call is safe, which is what a publish retried after a timeout needs, but the two
 * repeats differ. Writing a hash the store already holds leaves the file alone — a content address
 * that already resolves holds the same bytes by construction. Publishing the same route and hash
 * again does not: the pointer is rewritten with a fresh `updatedAt` and a second move is appended
 * to the log. Content addressing dedupes artifacts, not moves.
 *
 * Every `ArtifactStore` method is implemented, `history` included, so a caller reading a route's
 * moves needs no `?? []` fallback for this store. Within one publish the pointer moves first and
 * the log is appended after: a crash between the two leaves the log one entry short, which
 * under-reports. The opposite order would let the log claim a publish that never went live.
 *
 * @param root - The directory the store owns, absolute or resolved against `process.cwd()`. It
 *   owns everything beneath it, so give it a directory nothing else writes into. Two stores over
 *   one root are the same store, and so is a second process pointed at it — the state is the files.
 * @returns An `ArtifactStore` bound to `root`. It holds no cache and no open handle: every call
 *   reads the filesystem, so one built at module scope stays correct as other processes publish
 *   underneath it.
 *
 * @throws {NubbinError} From `publish`, coded `artifact-not-stored` when nothing has been written
 *   at that hash. A pointer at an unwritten hash would be a live 404, so the existence check comes
 *   before the pointer is touched.
 * @throws {NubbinError} From `publish`, coded `invalid-route` when the route addresses no page.
 *   Core's `parseMatchKind` judges it, so an adapter that never called `compile` still cannot
 *   publish an unaddressable route.
 * @throws A Node filesystem error, unchanged, when the operation itself fails — no permission on
 *   `root`, a full disk, or a path taken by something that is not the expected kind of file.
 *   `ENOENT` alone is not one of these: it is how absence is read.
 * @throws A `SyntaxError` from `read`, `pointer` or `manifest` when a file under `root` is not the
 *   JSON this store wrote. Hand-editing the directory, or pointing two tools at one root, is what
 *   produces that.
 *
 * @example Compile, store, publish
 * ```ts
 * import { compile } from "@nubbin/core";
 * import { createFsArtifactStore } from "@nubbin/store-fs";
 *
 * const store = createFsArtifactStore("./.nubbin");
 *
 * const { artifact } = compile(version, catalog, registry, "/promotions/summer");
 * await store.write(artifact);
 * await store.publish(artifact.route, artifact.hash);
 * ```
 *
 * @example Serve a request from the store
 * ```ts
 * const pointer = await store.pointer("/promotions/summer");
 * const artifact = pointer === null ? null : await store.read(pointer.hash);
 * ```
 *
 * @example Roll a route back to what it pointed at before
 * ```ts
 * const moves = await store.history?.("/promotions/summer") ?? [];
 * const previous = moves.at(-2);
 * if (previous !== undefined) {
 *   await store.publish("/promotions/summer", previous.hash);
 * }
 * ```
 */
export function createFsArtifactStore(root: string): ArtifactStore {
  return {
    read: (hash) => readJsonOrNull<Artifact>(artifactPath(root, hash)),
    write: (artifact) => fsWriteArtifact(root, artifact),
    pointer: (route) => readJsonOrNull<RoutePointer>(pointerPath(root, route)),
    manifest: () => fsManifest(root),
    publish: (route, hash) => fsPublish(root, route, hash),
    unpublish: (route) => fsUnpublish(root, route),
    history: (route) => fsHistory(root, route),
  };
}
