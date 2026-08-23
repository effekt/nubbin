import { artifactMetadata, resolveArtifact } from "@nubbin/next";
import { Renderer } from "@nubbin/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { blockRegistry } from "@/nubbin/blockRegistry";
import { demoStore } from "@/nubbin/demoStore";
import { resolveDemoHole } from "@/nubbin/resolveDemoHole";

/**
 * Every route this catch-all serves renders on demand.
 *
 * `[[...slug]]` is the optional form: only it matches `/`, which the required `[...slug]`
 * cannot, so the adapter's root case (`routeFromSlug` maps an absent slug to `/`) would
 * otherwise be unreachable in its own reference consumer. The coded originals live under
 * `/reference/*`, so no literal route competes with this one for `/`.
 *
 * The demo resolves holes against its own `/api/now` — the only data source it has — so a page
 * carrying a hole cannot be rendered by a build, where nothing is listening: `/pricing` died
 * with ECONNREFUSED. Leaving those routes out of `generateStaticParams` did not help either,
 * because a route absent from it is still *statically generated on demand*, and a `"request"`
 * hole maps to `cache: "no-store"`, which that render refuses with `DYNAMIC_SERVER_USAGE`.
 * `connection()` in the page body was not enough to reopen it.
 *
 * So the whole route is dynamic. This costs the demo prerendering, which it was never actually
 * doing — with `.nubbin/` gitignored, a clean checkout published nothing before `next build`
 * and prerendered zero pages, which is why none of this surfaced. It costs the *product*
 * nothing: a consumer whose CMS is up during CI prerenders these pages normally.
 *
 * Publishing without a deploy is unaffected, and in fact simpler to see: every request reads
 * the pointer, so a route published a second ago serves immediately.
 */
export const dynamic = "force-dynamic";

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
