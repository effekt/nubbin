import { routeFromSlug } from "@nubbin/next";
import { notFound } from "next/navigation";
import { PuckEditor } from "../../../components/PuckEditor";
import { readDraft } from "../../../nubbin/readDraft";
import { toPuckData } from "../../../nubbin/toPuckData";

/** Every request re-reads the draft file, so a reload serves what the last save wrote. */
export const dynamic = "force-dynamic";

/**
 * The server half of the editor: read the route's draft and hand the client editor both
 * shapes — Puck's `Data` to display and the prior `DocumentVersion` the folds start from.
 * The page renders no chrome of its own; Puck is the shell, and the hidden heading is the
 * outline entry Puck's chrome does not provide.
 */
export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const route = routeFromSlug(slug);
  const draft = readDraft(route);
  if (draft === undefined) {
    notFound();
  }
  return (
    <>
      <h1 className="sr-only">Editing {route}</h1>
      <PuckEditor route={route} initialData={toPuckData(draft)} initialVersion={draft} />
    </>
  );
}
