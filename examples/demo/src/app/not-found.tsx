import Link from "next/link";

/**
 * What a route with no pointer serves. Next renders its own bare page without this, which is a
 * blank sheet for a reader and indistinguishable from a broken render for anyone debugging —
 * and an unpublished route is a thing this demo produces on purpose, twice.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-marine px-6 text-canvas">
      <div className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-light">
          Nothing published here
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight">
          No dispatch at this address
        </h1>
        <p className="mt-4 text-canvas/70">
          Either it has been taken down, or it has not been filed yet. The morning&rsquo;s
          dispatches are all in one place.
        </p>
        <Link
          className="mt-8 inline-block rounded bg-orange px-5 py-3 font-semibold text-canvas"
          href="/dispatches"
        >
          Read the dispatches
        </Link>
      </div>
    </main>
  );
}
