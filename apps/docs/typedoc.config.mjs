// Reference pages are generated from the packages' own sources, so the documented surface is
// whatever `src/index.ts` exports rather than a list maintained beside it.
//
// Each package is read from source, and a sibling's types resolve through its `dist`, so
// `turbo.json` names the five package builds as this one's dependencies. `^build` cannot do
// it: this workspace imports none of them, so it has no dependencies for `^` to expand to,
// and the docs build was free to run before any `dist` existed.
//
// `packages` strategy: TypeDoc converts each package independently against its own
// tsconfig, then merges the projects into one site. Options that affect conversion belong in
// `packageOptions` — a root-level setting does not cascade into a sub-project.
/** @type {Partial<import("typedoc").TypeDocOptions>} */
export default {
  entryPointStrategy: "packages",
  entryPoints: [
    "../../packages/cli",
    "../../packages/core",
    "../../packages/next",
    "../../packages/react",
    "../../packages/store-fs",
    "../../packages/studio",
  ],
  packageOptions: {
    entryPoints: ["src/index.ts"],
    tsconfig: "tsconfig.json",
  },
  // Resolved from this file rather than named: pnpm isolates each package, and TypeDoc
  // imports a bare plugin specifier relative to its own location in the store, where
  // nothing this workspace depends on is reachable.
  plugin: [
    // Resolved rather than named: pnpm isolates each package, and TypeDoc imports a bare
    // specifier relative to its own location in the store, where nothing this workspace
    // depends on is reachable.
    import.meta.resolve("typedoc-plugin-markdown"),
    // A relative path, which TypeDoc resolves against this file. Resolving it the way the
    // package above is resolved would bake an absolute `file://` URL into the config, and
    // knip reads this file to find what it depends on — a URL is not a specifier it can
    // follow, so the plugin read as an unresolved import.
    "./typedocFrontmatter.mjs",
  ],
  // The breadcrumb duplicates navigation Docusaurus already draws, and putting it above the
  // page title is what hid the heading from the sidebar in the first place.
  // The merged project is the API reference, and its name is what the root page is titled.
  // Left alone it renders as "Documentation", which says nothing beside six documents that
  // are also documentation.
  name: "API Reference",
  // Every package here shares one scope, so the `@nubbin` directory it would otherwise add
  // is a level of nesting that separates nothing. The package pages keep their scoped names
  // as titles; only the paths lose it.
  excludeScopesInPaths: true,
  hideBreadcrumbs: true,
  hidePageHeader: true,
  // Beside the hand-written reference pages, which is where a reader already looks for the
  // shipped surface. Generated on every docs build and gitignored — never committed.
  //
  // `generated` rather than `api`: `danglingFileRefs.mjs` anchors a bare span like `api.md`
  // to any directory whose entry stems include `api`, so writing the pages there made two
  // documents that name `api.md` in prose read as naming a file beside them. `packages`,
  // `next` and `examples` are unusable for the same reason — each is the first segment of a
  // span already in `docs/reference/`.
  out: "../../docs/reference/generated",
  readme: "none",
  githubPages: false,
};
