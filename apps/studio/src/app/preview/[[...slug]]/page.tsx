import { NubbinError } from "@nubbin/core";
import { routeFromSlug } from "@nubbin/next";
import { Renderer } from "@nubbin/react";
import studioConfig from "@nubbin/studio-config";
import { notFound } from "next/navigation";
import { PreviewRefusal } from "../../../components/PreviewRefusal";
import { PreviewToolbar } from "../../../components/PreviewToolbar";
import { compileVersion } from "../../../nubbin/compileVersion";
import { readDraft } from "../../../nubbin/readDraft";
import { studioStore } from "../../../nubbin/studioStore";

/**
 * The consumer's render path — `compile` into `Renderer` with its configured block registry —
 * given the current draft instead of a stored artifact. A pure publish-parity render:
 * editing lives at `/edit`, this page shows exactly what publish would freeze.
 * Awaiting `searchParams` keeps the page dynamic, so every request recompiles and re-reads
 * the pointer — which is what makes a saved edit appear on refresh. A draft the compiler
 * refuses — a page created empty, most commonly — previews as the refusal itself rather
 * than a crash, because the refusal is exactly what publish would say.
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ published?: string }>;
}) {
  const { slug } = await params;
  const { published } = await searchParams;
  const route = routeFromSlug(slug);
  const draft = readDraft(route);
  if (draft === undefined) {
    notFound();
  }
  let artifact: ReturnType<typeof compileVersion>;
  try {
    artifact = compileVersion(draft, route);
  } catch (error) {
    if (error instanceof NubbinError) {
      return <PreviewRefusal route={route} issues={error.issues} />;
    }
    throw error;
  }
  const pointer = await studioStore().pointer(route);
  return (
    <>
      <PreviewToolbar artifact={artifact} publishedHash={pointer?.hash} justPublished={published} />
      <Renderer
        artifact={artifact}
        registry={studioConfig.blockRegistry}
        resolveHole={studioConfig.resolveHole}
      />
    </>
  );
}
