import { artifactMetadata, resolveArtifact, staticRouteParams } from "@nubbin/next";
import { Renderer } from "@nubbin/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { blockRegistry } from "@/nubbin/blockRegistry";
import { demoStore } from "@/nubbin/demoStore";
import { resolveDemoHole } from "@/nubbin/resolveDemoHole";

/**
 * `[[...slug]]`, the optional form: a pointer at `/` yields `{ slug: [] }` from
 * `staticRouteParams`, which only the optional form accepts — the required `[...slug]` cannot
 * match `/` at all, so the adapter's root case (`routeFromSlug` maps an absent slug to `/`)
 * would be unreachable in its own reference consumer. The coded originals live under
 * `/reference/*`, so no literal route competes with this one for `/`.
 *
 * A route published after this build is absent from `generateStaticParams` and still resolves
 * here rather than 404ing, because `dynamicParams` defaults to true and nothing turns it off.
 * That default is the whole publish-without-deploy claim, and #55 measures it.
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return staticRouteParams(demoStore);
}

/**
 * `cache` because Next calls `generateMetadata` and the page for one request, and both need the
 * same artifact — without it the store is read twice per render. Keyed on the resolved slug
 * array's identity, which Next passes as the same object to both.
 */
const artifactForSlug = cache(async (slug: string[] | undefined) =>
  resolveArtifact(demoStore, slug),
);

/**
 * `compile` writes `meta` into every artifact, and this is what reads it: the title, description,
 * robots and canonical a page carries come from the document that was published, not from the
 * code that serves it. An unpublished route resolves to null and takes the layout's metadata,
 * which is the right answer for the 404 the page component is about to render.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return artifactMetadata(await artifactForSlug(slug));
}

// `blockRegistry`, the render-side map — never `registry`, which is what compile validates
// against. `notFound()` returns `never`, so `artifact` narrows with no non-null assertion.
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const artifact = await artifactForSlug(slug);
  if (!artifact) {
    notFound();
  }
  return <Renderer artifact={artifact} registry={blockRegistry} resolveHole={resolveDemoHole} />;
}
