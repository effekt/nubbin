"use client";

import "./richTextField.css";
import type { FieldNode, RichTextSpan } from "@nubbin/core";
import { useState } from "react";
import { asRichTextValue } from "../nubbin/asRichTextValue";
import { withRichTextBlockAdded } from "../nubbin/withRichTextBlockAdded";
import { withRichTextSpan } from "../nubbin/withRichTextSpan";
import { withSpanLinkToggled } from "../nubbin/withSpanLinkToggled";
import { withSpanMarkToggled } from "../nubbin/withSpanMarkToggled";
import { ReadOnlyField } from "./ReadOnlyField";
import { RichTextAddBlock } from "./RichTextAddBlock";
import { RichTextBlockList } from "./RichTextBlockList";
import { RichTextToolbar } from "./RichTextToolbar";
import type { RichTextSelection } from "./richTextSelection.types";

interface RichTextFieldProps {
  id: string;
  label: string;
  field: FieldNode;
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown) => void;
}

/** The wireframes' RichTextControl: the typed blocks and spans a `richText()` field holds,
 * edited as the structure they are behind a fixed toolbar over `core`'s closed sets.
 * Nothing here parses or emits markup — every change is a pure edit of the typed document,
 * so unmodeled input cannot exist rather than being caught, and a value that is not rich
 * text shows read-only as it was found. Saving stays permissive; publish is the gate. */
export function RichTextField(props: RichTextFieldProps) {
  const { id, label, field, value, readOnly, onChange } = props;
  const [selection, setSelection] = useState<RichTextSelection | undefined>(undefined);
  const doc = asRichTextValue(value);
  if (doc === undefined) return <ReadOnlyField id={id} field={{ ...field, value }} />;
  const selected =
    selection === undefined ? undefined : doc[selection.block]?.spans[selection.span];
  const applyToSelected = (next: RichTextSpan) => {
    if (selection !== undefined)
      onChange(withRichTextSpan(doc, selection.block, selection.span, next));
  };
  return (
    <fieldset id={id} className="nb-richtext" aria-label={label}>
      <RichTextToolbar
        span={selected}
        readOnly={readOnly}
        onToggleMark={(mark) => {
          if (selected !== undefined) applyToSelected(withSpanMarkToggled(selected, mark));
        }}
        onToggleLink={() => {
          if (selected !== undefined) applyToSelected(withSpanLinkToggled(selected));
        }}
      />
      <RichTextBlockList
        id={id}
        doc={doc}
        readOnly={readOnly}
        selection={selection}
        onSelect={setSelection}
        onChange={onChange}
      />
      <RichTextAddBlock
        readOnly={readOnly}
        onAdd={(kind) => onChange(withRichTextBlockAdded(doc, kind))}
      />
    </fieldset>
  );
}
