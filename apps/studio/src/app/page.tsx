import studioConfig from "@nubbin/studio-config";
import { BlockFields } from "../components/BlockFields";
import { listEditableRoutes } from "../nubbin/listEditableRoutes";
import { prefixedRoute } from "../nubbin/prefixedRoute";

/** Everything on this page is derived: routes from the same listing the editor's switcher
 * reads — fixtures plus any draft-only pages — and blocks and fields from the catalog's
 * schemas. Two surfaces listing routes from two sources is how a New page went missing
 * here while the switcher showed it. */

// The drafts directory changes between requests, so the listing cannot freeze at build.
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 text-marine">
      <h1 className="font-semibold text-3xl">Nubbin studio</h1>
      <section aria-labelledby="drafts-heading" className="mt-8">
        <h2 id="drafts-heading" className="font-semibold text-xl">
          Drafts
        </h2>
        <ul className="mt-3 list-disc pl-6">
          {listEditableRoutes().map((route) => (
            <li key={route} className="py-0.5">
              <a
                className="text-teal underline underline-offset-4"
                href={prefixedRoute("/edit", route)}
              >
                {route}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="blocks-heading" className="mt-10">
        <h2 id="blocks-heading" className="font-semibold text-xl">
          Blocks
        </h2>
        <div className="mt-3 flex flex-col gap-4">
          {Object.entries(studioConfig.catalog).map(([name, entry]) => (
            <BlockFields key={name} name={name} entry={entry} />
          ))}
        </div>
      </section>
    </main>
  );
}
