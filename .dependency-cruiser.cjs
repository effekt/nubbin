/**
 * Mechanical enforcement of `.claude/rules/package-boundaries.md`.
 *
 * The portability of `core` is the product's central claim — it has to run in a browser
 * studio, a worker, and a CI step. A review can miss a stray `node:crypto` import; this
 * cannot.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "core-imports-no-node-builtins",
      severity: "error",
      comment:
        "core must run in a browser and a worker, so it may not reach for node builtins. " +
        "Move the IO behind an adapter interface. See .claude/rules/package-boundaries.md.",
      from: { path: "^packages/core/src" },
      to: { dependencyTypes: ["core"] },
    },
    {
      name: "core-imports-no-framework",
      severity: "error",
      comment:
        "core is framework-agnostic. Component types reach it as a generic parameter, never " +
        "as an import. See .claude/rules/package-boundaries.md.",
      from: { path: "^packages/core/src" },
      // Matches the bare specifier as well as a resolved node_modules path: with no framework
      // installed the import stays unresolved as "react", and a resolved-path-only pattern
      // lets exactly the import this rule exists to reject pass unflagged.
      to: { path: "(^|/)node_modules/(react|react-dom|next)(/|$)|^(react|react-dom|next)(/|$)" },
    },
    {
      name: "core-depends-on-nothing-local",
      severity: "error",
      comment: "core is the bottom of the graph — it may not import a sibling package.",
      from: { path: "^packages/core/src" },
      to: { path: "^packages/(?!core/)" },
    },
    {
      name: "no-cross-adapter-imports",
      severity: "error",
      comment:
        "Adapters are independent and interchangeable; they compose through core, never " +
        "through each other. (`next` depending on `react` is the one allowed exception.)",
      from: { path: "^packages/store-fs/src" },
      to: { path: "^packages/(react|next)/" },
    },
    {
      name: "no-react-to-next",
      severity: "error",
      comment: "The React binding must not depend on Next — the dependency runs the other way.",
      from: { path: "^packages/react/src" },
      to: { path: "^packages/(next|store-fs)/" },
    },
    {
      name: "react-imports-no-node-builtins",
      severity: "error",
      comment:
        "@nubbin/react renders in any React server environment, including ones with no node " +
        "builtins. IO belongs in an adapter. See .claude/rules/package-boundaries.md.",
      from: { path: "^packages/react/src" },
      // `dependencyTypes`, not a path: dependency-cruiser classifies builtins by type, and a
      // `^node:` path pattern matches none of them. Verified by seeding the import.
      to: { dependencyTypes: ["core"] },
    },
    {
      name: "react-package-portable",
      severity: "error",
      comment:
        "@nubbin/react must not depend on Next — the dependency runs the other way. " +
        "See .claude/rules/package-boundaries.md.",
      from: { path: "^packages/react/src" },
      // Bare specifier as well as a resolved path: `next` is not installed here, so a
      // resolved-path-only pattern lets exactly the import this rule rejects pass unflagged.
      to: { path: "(^|/)node_modules/next(/|$)|^next(/|$)" },
    },
    {
      name: "store-fs-imports-no-framework",
      severity: "error",
      comment:
        "A storage adapter is IO around core's types; a react or next import is a category " +
        "error. See .claude/rules/adapters.md.",
      from: { path: "^packages/store-fs/src" },
      to: { path: "(^|/)node_modules/(react|react-dom|next)(/|$)|^(react|react-dom|next)(/|$)" },
    },
    {
      name: "cli-imports-no-framework",
      severity: "error",
      comment:
        "The CLI publishes with no framework loaded — which is what lets it run in a CI job " +
        "that installs no React. See .claude/rules/package-boundaries.md.",
      from: { path: "^packages/cli/src" },
      to: { path: "(^|/)node_modules/(react|react-dom|next)(/|$)|^(react|react-dom|next)(/|$)" },
    },
    {
      name: "cli-composes-through-core",
      severity: "error",
      comment:
        "The CLI drives the publish path through core and whatever store a consumer configured. " +
        "A binding import would tie a terminal command to one framework.",
      from: { path: "^packages/cli/src" },
      to: { path: "^packages/(react|next)/" },
    },
    {
      name: "studio-headless-imports-no-ui-runtime",
      severity: "error",
      comment:
        "@nubbin/studio is the headless transport and server-handler package. React, Puck, " +
        "Next, and the assembled UI belong in @nubbin/studio-ui.",
      from: { path: "^packages/studio/src" },
      to: {
        path:
          "(^|/)node_modules/(react|react-dom|next|@measured/puck)(/|$)|" +
          "^(react|react-dom|next|@measured/puck)(/|$)|^packages/(react|studio-ui)/",
      },
    },
    {
      name: "studio-ui-imports-no-node-builtins",
      severity: "error",
      comment:
        "@nubbin/studio-ui is a portable React editor package. Server IO remains behind " +
        "@nubbin/studio contracts.",
      from: { path: "^packages/studio-ui/src" },
      to: { dependencyTypes: ["core"] },
    },
    {
      name: "studio-ui-imports-no-host-framework",
      severity: "error",
      comment:
        "@nubbin/studio-ui is portable across React hosts; host-framework behavior belongs " +
        "in the consuming application.",
      from: { path: "^packages/studio-ui/src" },
      to: { path: "(^|/)node_modules/next(/|$)|^next(/|$)" },
    },
    {
      name: "cli-plan-imports-no-node-builtins",
      severity: "error",
      // `dependencyTypes`, not a path, for the reason the react rule above gives.
      comment:
        "@nubbin/cli/plan is bundled by a browser; a builtin in its graph breaks that bundle.",
      from: { path: "^packages/cli/src/plan/" },
      to: { dependencyTypes: ["core"] },
    },
    {
      name: "cli-plan-is-self-contained",
      severity: "error",
      comment: "Reaching past the plan entry's own modules pulls the config loader into a bundle.",
      from: { path: "^packages/cli/src/plan/" },
      to: { pathNot: ["^packages/cli/src/plan/", "(^|/)@standard-schema/spec(/|$)"] },
    },
    {
      name: "no-deep-package-imports",
      severity: "error",
      comment:
        "Import a package through its published entrypoint only. A deep path becomes a " +
        "de-facto API that semver cannot protect.",
      // The capture group is what makes this a *cross*-package rule. Without it the pattern
      // matches a package importing its own modules, which every package with more than one
      // file does — so the rule failed everything the moment real code existed.
      //
      // `examples` is in the list because the example app is the only consumer of a package
      // that exists here. Leaving it out scoped the rule to callers that do not yet exist,
      // so a deep import from the demo cruised clean.
      from: { path: "^(?:packages|apps|examples)/([^/]+)/" },
      to: {
        path: "^packages/[^/]+/src/",
        pathNot: ["^packages/[^/]+/src/index\\.tsx?$", "^packages/$1/"],
      },
    },
    {
      name: "no-app-in-packages",
      severity: "error",
      comment: "Packages are libraries; they may not depend on an app.",
      from: { path: "^packages/[^/]+/src" },
      to: { path: "^apps/" },
    },
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies make load order undefined and tree-shaking unreliable.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      severity: "error",
      comment:
        "An orphan module is unreachable — either wire it up or delete it. Error, not warn: " +
        "depcruise exits 0 on warnings, so `pnpm boundaries` reported orphans and passed.",
      // `src/testing/` is exempt because test files are excluded from the graph below, so a
      // module imported only by a test has no visible incoming edge and reads as an orphan.
      // Nothing is lost: knip follows test files and still fails on an unused file there.
      from: {
        orphan: true,
        // A framework's special files are resolved by convention, so nothing imports them and
        // every one of them reads as an orphan. The same set `tests/oneUnitPerFile.test.mjs`
        // exempts, for the same reason.
        pathNot:
          "\\.d\\.ts$|\\.config\\.[cm]?[jt]s$|(^|/)src/testing/|" +
          "(^|/)(page|layout|route|template|loading|error|not-found|default|global-error)\\.tsx?$",
      },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: "(^|/)(node_modules|dist|\\.next|\\.docusaurus|coverage)($|/)" },
    exclude: {
      path: [
        "node_modules",
        "\\.test\\.(ts|tsx)$",
        "__tests__/",
        "/dist/",
        "\\.next/",
        // Docusaurus's generated route/state modules under apps/docs/.docusaurus — build
        // output, not source, exactly as .next/ is for the example app.
        "\\.docusaurus/",
        "/coverage/",
        "\\.d\\.ts$",
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "node", "default", "types"],
      mainFields: ["main", "types"],
    },
  },
};
