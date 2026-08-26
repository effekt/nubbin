import type { DocumentConflict } from "@nubbin/core";

/** Displays one preserved side of a draft conflict, including an explicit deletion. */
export function ConflictValue({
  label,
  value,
}: {
  label: string;
  value: DocumentConflict["local"];
}) {
  return (
    <div>
      <span>{label}</span>
      <pre>{value.present ? JSON.stringify(value.value, null, 2) : "Deleted"}</pre>
    </div>
  );
}
