# @nubbin/next

The Next.js binding for Nubbin. Reading a page is one pointer read and one artifact read;
publishing is a pointer move and a single-route invalidation. Neither is a deploy.

```bash
npm install @nubbin/next
```

```ts
import { resolveArtifact, staticRouteParams, publishRoute } from "@nubbin/next";

export const generateStaticParams = () => staticRouteParams(store);

export default async function Page({ params }) {
  const artifact = await resolveArtifact(store, (await params).slug);
  if (!artifact) notFound();      // an unpublished route has no pointer
  // …render it
}

await publishRoute(store, "/promotions/summer", hash);   // pointer, then revalidatePath
```

`publishRoute` moves the pointer *before* invalidating. The other order re-caches the outgoing
page in the gap, and the publish appears to have silently not happened. A store rejection
propagates without invalidating, so a failed publish never purges a working page.

Requires Next.js 16 or newer. Read the [Nubbin documentation](https://nubbin.io) for the
complete Next.js integration reference. MIT.
