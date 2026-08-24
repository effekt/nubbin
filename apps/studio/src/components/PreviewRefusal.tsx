import type { NubbinIssue } from "@nubbin/core";
import { prefixedRoute } from "../nubbin/prefixedRoute";

interface PreviewRefusalProps {
  route: string;
  issues: readonly NubbinIssue[];
}

/** What the preview shows when the draft does not compile — a brand-new page with no
 * blocks yet included. Preview is publish parity, so instead of a crashed page it says
 * what publish would say, one line per issue, and points back at the editor where the fix
 * lives. */
export function PreviewRefusal({ route, issues }: PreviewRefusalProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-marine">
      <h1 className="font-semibold text-2xl">Nothing to preview yet</h1>
      <p className="mt-3">
        The preview shows exactly what publishing <strong>{route}</strong> would freeze, and the
        compiler refuses this draft as it stands:
      </p>
      <ul className="mt-3 list-disc pl-6">
        {issues.map((issue) => (
          <li key={`${issue.code}:${issue.at ?? ""}:${issue.message}`}>{issue.message}</li>
        ))}
      </ul>
      <p className="mt-4">
        <a className="text-teal underline underline-offset-4" href={prefixedRoute("/edit", route)}>
          Back to the editor
        </a>
      </p>
    </main>
  );
}
