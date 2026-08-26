import "./issuesFlow.css";
import type { InspectorField } from "./inspector.types";

const JSON_INDENT = 1;

/** The kinds without a single control — `array`, `object`, `union`, `unknown`, and any
 * `items[]` path — shown as data rather than hidden, so the author still sees what is there.
 * The region carries the same field id every editable control renders and is focusable
 * programmatically without joining the tab order, so an issue row's Go-to-it lands here —
 * and these are exactly the values an issue most often names. */
export function ReadOnlyField({ id, field }: { id: string; field: InspectorField }) {
  return (
    <div id={id} tabIndex={-1} className="nubbin-readonly mt-3">
      <code className="text-marine/70 text-xs">{field.path}</code>
      <p className="mt-0.5 text-marine/70 text-xs">{field.kind} — read-only</p>
      {field.value === undefined ? null : (
        <pre className="mt-1 max-h-24 overflow-auto rounded-sm bg-canvas p-2 text-xs">
          {JSON.stringify(field.value, null, JSON_INDENT)}
        </pre>
      )}
    </div>
  );
}
