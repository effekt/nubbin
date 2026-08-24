import type { Artifact } from "@nubbin/core";
import type { Metadata } from "next";

// Maps a compiled artifact's `meta` onto Next's `Metadata`, so the mapping is owned by the
// binding rather than re-decided in every consumer's `generateMetadata` — the same reason
// `holeFetchOptions` owns the hole-lifecycle mapping.
//
// `compile` has written `meta` into every artifact since the first one, and until this existed
// nothing read it: a published page could not set its own title. The shapes differ in one place
// — a document's `canonical` is a flat field, and Next reads a canonical URL from
// `alternates.canonical` — so that is the only thing this translates rather than copies.
//
// A null artifact returns an empty object rather than a title, because the caller is about to
// render a 404 and the layout's own metadata is the right answer for it.
//
// Optional fields are assigned only when present. `exactOptionalPropertyTypes` is on, and a
// `description: undefined` sent to Next is an instruction to emit an empty tag rather than an
// absence.
/**
 * Turns a resolved artifact into the `Metadata` Next emits into the document head, so the title
 * and meta tags a page carries come from the document that was published rather than from the
 * code serving it.
 *
 * @param artifact - What `resolveArtifact` answered with. `null` is the unpublished case and
 *   belongs here, so a caller resolves once and hands the same value to the page and to
 *   `generateMetadata`.
 * @returns `title` always, `description` and `robots` when the document carried them, and
 *   `canonical` moved under `alternates`, which is where Next reads one. A field the document
 *   omitted is omitted here rather than set to `undefined`. A `null` artifact answers `{}`,
 *   leaving the layout's own metadata standing for the 404 the page is about to render.
 * @example
 * ```ts
 * export async function generateMetadata({
 *   params,
 * }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
 *   const { slug } = await params;
 *   return artifactMetadata(await resolveArtifact(store, slug));
 * }
 * ```
 */
export function artifactMetadata(artifact: Artifact | null): Metadata {
  if (artifact === null) {
    return {};
  }
  const { title, description, robots, canonical } = artifact.meta;
  const metadata: Metadata = { title };
  if (description !== undefined) metadata.description = description;
  if (robots !== undefined) metadata.robots = robots;
  if (canonical !== undefined) metadata.alternates = { canonical };
  return metadata;
}
