import { artifactMetadata, resolveArtifact } from "@nubbin/next";
import { Renderer } from "@nubbin/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { blockRegistry } from "@/nubbin/blockRegistry";
import { demoStore } from "@/nubbin/demoStore";
import { resolveDemoHole } from "@/nubbin/resolveDemoHole";

/**
 * Nothing about Nubbin is in the build, and a published page is rendered once.
 *
 * `generateStaticParams` returns an empty list, and both halves of that matter. Its presence is
 * what makes the route statically generatable — a dynamic segment without one is served
 * dynamically on every request, with no cache for a publish to invalidate. Its emptiness is what
 * keeps every published route out of the build: paths are generated on first request rather than
 * enumerated at build time, so the build reads no store and names no page.
 *
 * A publish is what regenerates a page: `publishRoute` calls `revalidatePath`, so the pointer
 * moving is the only thing that rebuilds it.
 *
 * Server-rendered data is unaffected by any of that, and is the point of the arrangement rather
 * than a casualty of it: a `{ revalidate: n }` hole is resolved on the server, against whatever
 * the consumer's `resolveHole` reads, and the value is generated into the cached page. A price or
 * an inventory count is exactly this shape — fetched by the server, cached, refreshed on an
 * interval, and never rebuilt per request.
 *
 * What no artifact here carries is a `"request"` hole. That hint maps to `cache: "no-store"`,
 * which a cached render refuses, and the choice is per route rather than per path — so one such
 * field anywhere takes every page with it. It remains a supported hint; this demo simply has no
 * field that genuinely differs on every hit, which is the only thing it buys.
 *
 * `[[...slug]]` is the optional form: only it matches `/`, which the required `[...slug]` cannot,
 * so the adapter's root case (`routeFromSlug` maps an absent slug to `/`) would otherwise be
 * unreachable in its own reference consumer. The coded originals live under `/reference/*`, so no
 * literal route competes with this one for `/`.
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return [];
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
