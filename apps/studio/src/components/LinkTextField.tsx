"use client";

import "./issuesFlow.css";
import "./linkField.css";
import { FieldLabel } from "@measured/puck";
import { ConsumerOriginContext } from "@nubbin/studio-ui";
import { useContext } from "react";
import { linkNoteLine } from "../nubbin/linkNoteLine";
import { openLinkLabel } from "../nubbin/openLinkLabel";
import { toLinkKind } from "../nubbin/toLinkKind";
import { toOpenHref } from "../nubbin/toOpenHref";
import { BoundedTextMeta } from "./BoundedTextMeta";

interface LinkTextFieldProps {
  id: string;
  label: string;
  max?: number | undefined;
  value: string | undefined;
  readOnly: boolean;
  onChange: (value: string) => void;
}

/** The text control for a string the catalog hints as a link: format-checked as the author
 * types, and openable when the check passes. A value that is neither an absolute http(s)
 * URL nor a root-relative path gets the quiet note — display only, because the draft stays
 * permissive and the schema judges at publish. A valid one gets Open, a real anchor whose
 * relative paths resolve against the consumer origin the server handed the editor. The
 * schema's own bound, where it declares one, keeps its counter. */
export function LinkTextField({ id, label, max, value, readOnly, onChange }: LinkTextFieldProps) {
  const origin = useContext(ConsumerOriginContext);
  const text = value ?? "";
  const openHref = text === "" ? undefined : toOpenHref(text, origin);
  const isOver = max !== undefined && text.length > max;
  return (
    <FieldLabel label={label} readOnly={readOnly}>
      <div className={isOver ? "nubbin-bounded-over" : undefined}>
        <input
          type="text"
          id={id}
          className="nubbin-bounded-input"
          value={text}
          readOnly={readOnly}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
        {text !== "" && toLinkKind(text) === undefined ? (
          <p className="nubbin-link-note">{linkNoteLine()}</p>
        ) : null}
        {openHref !== undefined ? (
          <a
            className="nubbin-link-open"
            href={openHref}
            target="_blank"
            rel="noreferrer"
            aria-label={openLinkLabel(openHref)}
          >
            Open ↗
          </a>
        ) : null}
        {max !== undefined ? <BoundedTextMeta max={max} length={text.length} /> : null}
      </div>
    </FieldLabel>
  );
}
