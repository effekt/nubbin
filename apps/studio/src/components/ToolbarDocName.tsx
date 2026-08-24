"use client";

import { usePuck } from "@measured/puck";
import { useContext } from "react";
import { titleFromRoute } from "../nubbin/titleFromRoute";
import { ConsumerOriginContext } from "./ConsumerOriginContext";
import { toDocAddress } from "./toDocAddress";

/** The toolbar's document identity, as the specimen writes it: the page's own title
 * prominent, and the page's address beside it in the mono URL pill — host and route,
 * resolved against the consumer origin, opening the live page in its own tab. The title is
 * the draft's `meta.title` living in Puck's root props, so renaming the page renames the
 * toolbar as the author types; a draft without one falls back to the name the route
 * implies, and a toolbar without an origin shows the bare route and opens nothing. */
export function ToolbarDocName({ route }: { route: string }) {
  const { appState } = usePuck();
  const address = toDocAddress(useContext(ConsumerOriginContext), route);
  const title = appState.data.root.props?.title;
  return (
    <>
      <span className="nb-tb-docname">
        {typeof title === "string" && title !== "" ? title : titleFromRoute(route)}
      </span>
      {address.href === undefined ? (
        <span className="nb-tb-docaddr">{address.label}</span>
      ) : (
        <a className="nb-tb-docaddr" href={address.href} target="_blank" rel="noreferrer">
          {address.label}
        </a>
      )}
    </>
  );
}
