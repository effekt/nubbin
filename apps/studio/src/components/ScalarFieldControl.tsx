"use client";

import { asStringValue } from "../nubbin/asStringValue";
import { isLinkField } from "../nubbin/isLinkField";
import { leafFieldName } from "../nubbin/leafFieldName";
import { BooleanSubField } from "./BooleanSubField";
import { BoundedTextField } from "./BoundedTextField";
import { EnumSubField } from "./EnumSubField";
import { LinkTextField } from "./LinkTextField";
import { NumberInputField } from "./NumberInputField";
import { PlainTextField } from "./PlainTextField";
import { ReadOnlyField } from "./ReadOnlyField";
import type { SubFieldProps } from "./subField.types";

/** One scalar field nested in a row or fieldset, rendered by the same rules as the top
 * level: bounded strings get the counter, small enums the segments, booleans a two-segment
 * row, and a kind with no control shows its value read-only rather than guessing. */
export function ScalarFieldControl({ field, id, value, readOnly, onChange }: SubFieldProps) {
  const label = leafFieldName(field.path);
  const common = { id, label, readOnly };
  if (isLinkField(field)) {
    return (
      <LinkTextField
        {...common}
        max={field.maxLength}
        value={asStringValue(value)}
        onChange={onChange}
      />
    );
  }
  if (field.kind === "string" && field.maxLength !== undefined) {
    return (
      <BoundedTextField
        {...common}
        max={field.maxLength}
        value={asStringValue(value)}
        onChange={onChange}
      />
    );
  }
  if (field.kind === "string") {
    return <PlainTextField {...common} value={asStringValue(value)} onChange={onChange} />;
  }
  if (field.kind === "number") {
    const numeric = typeof value === "number" ? value : undefined;
    return <NumberInputField {...common} value={numeric} onChange={onChange} />;
  }
  if (field.kind === "boolean") {
    return <BooleanSubField {...common} value={value} onChange={onChange} />;
  }
  if (field.kind === "enum") {
    return (
      <EnumSubField
        {...common}
        members={field.members ?? []}
        value={asStringValue(value)}
        onChange={onChange}
      />
    );
  }
  return <ReadOnlyField id={id} field={{ ...field, value }} />;
}
