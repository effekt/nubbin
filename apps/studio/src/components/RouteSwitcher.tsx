"use client";

import "./routeSwitcher.css";
import { useCallback, useRef, useState } from "react";
import { goToEditor } from "../nubbin/goToEditor";
import { prefixedRoute } from "../nubbin/prefixedRoute";
import { NewRouteForm } from "./NewRouteForm";
import { useCloseOnEscape } from "./useCloseOnEscape";

interface RouteSwitcherProps {
  route: string;
  routes: readonly string[];
}

/** The toolbar's Pages control: a disclosure button opening the list of every editable
 * route — fixtures and studio-created pages alike, the current one marked — with "New
 * page" at the foot. The document being edited is named by the doc-name beside it, so the
 * button itself stays the specimen's plain "Pages". Real links do the switching, so the
 * keyboard, middle-click and the address bar all behave; Escape closes and hands focus
 * back to the button. */
export function RouteSwitcher({ route, routes }: RouteSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [naming, setNaming] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setNaming(false);
    buttonRef.current?.focus();
  }, []);
  useCloseOnEscape(open, close);
  return (
    <div className="nubbin-pages">
      <button
        type="button"
        ref={buttonRef}
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="nubbin-pages-eyebrow">Pages</span>
        <span aria-hidden="true" className="nubbin-pages-caret">
          ▾
        </span>
      </button>
      {open ? (
        <nav aria-label="Pages" className="nubbin-pages-popup">
          <ul>
            {routes.map((entry) => (
              <li key={entry}>
                <a
                  href={prefixedRoute("/edit", entry)}
                  aria-current={entry === route ? "page" : undefined}
                >
                  {entry}
                </a>
              </li>
            ))}
          </ul>
          {naming ? (
            <NewRouteForm onCreated={goToEditor} />
          ) : (
            <button type="button" onClick={() => setNaming(true)}>
              New page…
            </button>
          )}
        </nav>
      ) : null}
    </div>
  );
}
