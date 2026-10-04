import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const PACKAGE_ROOT = resolve(import.meta.dirname, "..", "..");
const WORKSPACE_ROOT = resolve(PACKAGE_ROOT, "..", "..");

/** The packages a generated config imports, each linked to its workspace directory. */
const LINKED = ["cli", "core", "store-fs"];

/**
 * A consumer's directory, as `init` meets it: empty, inside a repository, and with bare
 * `@nubbin/*` specifiers resolving to the workspace packages' built `dist` — through junctions in
 * its own `node_modules`, which is how an installed package resolves and why a config written
 * here is loaded and typechecked the way a consumer's would be.
 *
 * The `.git` entry is what lets a command run from a subdirectory climb to the config: outside a
 * repository the search never leaves the working directory. The `tsconfig.json` extends the
 * repository's base options, so the generated file is held to the same `strict` and
 * `exactOptionalPropertyTypes` a consumer copying them would be, with `@types/node` found where
 * this package keeps it.
 */
export async function linkedConsumer(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-consumer-"));
  await mkdir(join(root, ".git"));
  await mkdir(join(root, "node_modules", "@nubbin"), { recursive: true });
  for (const name of LINKED) {
    const target = join(WORKSPACE_ROOT, "packages", name);
    await symlink(target, join(root, "node_modules", "@nubbin", name), "junction");
  }
  const tsconfig = {
    extends: join(WORKSPACE_ROOT, "tsconfig.base.json"),
    compilerOptions: {
      incremental: false,
      noEmit: true,
      types: ["node"],
      typeRoots: [join(PACKAGE_ROOT, "node_modules", "@types")],
    },
    include: ["nubbin.config.ts"],
  };
  await writeFile(join(root, "tsconfig.json"), JSON.stringify(tsconfig));
  return root;
}
