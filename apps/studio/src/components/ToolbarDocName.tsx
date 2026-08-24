"use client";

import { usePuck } from "@measured/puck";
import { titleFromRoute } from "../nubbin/titleFromRoute";

/** The toolbar's document identity, as the specimen writes it: the page's own title
 * prominent, and the route beside it in the URL pill. The title is the draft's `meta.title`
 * living in Puck's root props, so renaming the page renames the toolbar as the author
 * types; a draft without one falls back to the name the route implies. */
export function ToolbarDocName({ route }: { route: string }) {
  const { appState } = usePuck();
  const title = appState.data.root.props?.title;
  return (
    <>
      <span className="nb-tb-docname">
        {typeof title === "string" && title !== "" ? title : titleFromRoute(route)}
      </span>
      <span className="nb-tb-docaddr">{route}</span>
    </>
  );
}
