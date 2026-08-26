"use client";

import { directChildFields } from "./directChildFields";
import { FieldsetGroup } from "./FieldsetGroup";
import { isRichTextField } from "./isRichTextField";
import { leafFieldName } from "./leafFieldName";
import { RepeaterField } from "./RepeaterField";
import { RichTextField } from "./RichTextField";
import { ScalarFieldControl } from "./ScalarFieldControl";
import type { SubFieldProps } from "./subField.types";

/** The recursion the repeater and fieldset render each child through: an object becomes a
 * labelled fieldset, an array a nested repeater, and everything else a scalar control —
 * so a stat's bounded label and a nested list edit by the same rules at any depth. */
export function SubFieldControl(props: SubFieldProps) {
  const { field, fields, id, value, readOnly, onChange } = props;
  if (field.kind === "object") {
    return (
      <FieldsetGroup
        id={id}
        label={leafFieldName(field.path)}
        fields={directChildFields(fields, field.path)}
        allFields={fields}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        renderField={SubFieldControl}
      />
    );
  }
  if (field.kind === "array" && isRichTextField(field, fields)) {
    return (
      <RichTextField
        id={id}
        label={leafFieldName(field.path)}
        field={field}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  }
  if (field.kind === "array") {
    return (
      <RepeaterField
        id={id}
        label={leafFieldName(field.path)}
        field={field}
        fields={fields}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        renderField={SubFieldControl}
      />
    );
  }
  return <ScalarFieldControl {...props} />;
}
