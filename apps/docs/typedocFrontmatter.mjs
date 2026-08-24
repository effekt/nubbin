import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { RendererEvent } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

// Docusaurus names a page in the sidebar from its frontmatter, and typedoc writes none — so
// every package index arrived as `README.md` and the sidebar showed five identical "README"
// rows under a `@nubbin` folder, one per package, with nothing to tell them apart.
//
// The h1 is right there in the file and Docusaurus never reaches it: the page opens with a
// breadcrumb, so the first heading is not the first content. `hideBreadcrumbs` removes that
// and would be enough on its own, which is exactly why it is not relied on — a page's name in
// the navigation would then depend on the shape of its first paragraph.
//
// The reflection already knows what it is called. Stamping that as `title` makes the label a
// property of the symbol rather than of the rendered markdown.
export function load(app) {
  writeCategory(app);
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    const name = page.model?.name;
    if (!name) return;
    // Escaped and quoted: a title like `@nubbin/core` starts with a character YAML reads as an
    // alias, and one carrying a colon would end the key early.
    const title = String(name).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    page.contents = `---\ntitle: "${title}"\n---\n\n${page.contents ?? ""}`;
  });
}

// Docusaurus names a directory in the sidebar after the directory, so the generated tree
// arrived as "generated" — an implementation detail, sitting wherever "g" sorts among pages
// titled for what they explain. The category file is written here rather than committed
// because the directory it belongs to is written here: a tracked `_category_.json` beside
// gitignored siblings would be the only part of this tree a person could edit.
function writeCategory(app) {
  app.renderer.on(RendererEvent.END, () => {
    const out = app.options.getValue("out");
    writeFileSync(
      join(out, "_category_.json"),
      `${JSON.stringify({ label: "API Reference", position: 99 }, null, 2)}\n`,
    );
  });
}
