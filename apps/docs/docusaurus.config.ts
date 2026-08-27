import process from "node:process";
import type { Config } from "@docusaurus/types";

import { codeTheme } from "./codeTheme";

const siteUrl = process.env.NUBBIN_DOCS_URL ?? "https://effekt.github.io";
const baseUrl = process.env.NUBBIN_DOCS_BASE_URL ?? "/nubbin/";

// The site renders `docs/` in place — the documents' one home on `main` — so the content
// root points up and out of this workspace rather than at a copy of anything.
const config: Config = {
  title: "Nubbin",
  tagline: "Your components. Their pages. A page builder that lives inside your codebase.",
  // GitHub Pages remains the zero-configuration deployment. Another host supplies both values
  // when it mounts the same independently built application at a different origin or path.
  url: siteUrl,
  baseUrl,
  organizationName: "effekt",
  projectName: "nubbin",
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: {
    // `detect` keeps `.md` files on CommonMark, where `<Route>` in prose is text rather
    // than a component reference MDX fails to resolve.
    format: "detect",
    mermaid: true,
    hooks: { onBrokenMarkdownLinks: "throw" },
  },

  themes: ["@docusaurus/theme-mermaid"],
  presets: [
    [
      "classic",
      {
        docs: {
          path: "../../docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.config.ts",
          // The function form: the string form is joined to the doc's path relative to this
          // workspace, and `../../docs` normalises the repository out of the URL.
          editUrl: ({ docPath }: { docPath: string }) =>
            `https://github.com/effekt/nubbin/edit/main/docs/${docPath}`,
        },
        blog: false,
        pages: false,
        theme: { customCss: "./src/css/custom.css" },
      },
    ],
  ],
  themeConfig: {
    prism: { theme: codeTheme, darkTheme: codeTheme },
    navbar: {
      title: "Nubbin",
      items: [
        { href: "https://nubbin.io", label: "Site", position: "right" },
        { href: "https://www.npmjs.com/org/nubbin", label: "npm", position: "right" },
        { href: "https://github.com/effekt/nubbin", label: "GitHub", position: "right" },
      ],
    },
    // One package per row rather than a prose list: the packages column is the only place a
    // reader can go straight to a registry page, and a name missing from it is a package they
    // cannot find. `packageMetadata` holds the manifests to the same names.
    footer: {
      style: "dark",
      links: [
        {
          title: "Packages",
          items: [
            { label: "@nubbin/core", href: "https://www.npmjs.com/package/@nubbin/core" },
            { label: "@nubbin/react", href: "https://www.npmjs.com/package/@nubbin/react" },
            { label: "@nubbin/next", href: "https://www.npmjs.com/package/@nubbin/next" },
            { label: "@nubbin/cli", href: "https://www.npmjs.com/package/@nubbin/cli" },
            { label: "@nubbin/store-fs", href: "https://www.npmjs.com/package/@nubbin/store-fs" },
          ],
        },
        {
          title: "Docs",
          items: [
            { label: "Getting started", to: "/" },
            { label: "How it works", to: "/concepts/architecture" },
            { label: "API reference", to: "/reference/generated/" },
          ],
        },
        {
          title: "Elsewhere",
          items: [
            { label: "nubbin.io", href: "https://nubbin.io" },
            { label: "GitHub", href: "https://github.com/effekt/nubbin" },
            { label: "Issues", href: "https://github.com/effekt/nubbin/issues" },
          ],
        },
      ],
      copyright: "MIT licensed. Your components. Their pages.",
    },
  },
};

export default config;
