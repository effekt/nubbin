import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { loadConfig } from "./loadConfig";

const PIECES = `
export const catalog = { entries: {} };
export const registry = { get: () => undefined };
export const store = { kind: "memory" };
export const document = (route) => ({ route });
`;

/** Extensionless, the way application code imports — which is the reason a loader is here. */
const CONFIG = `
import { catalog, registry, store, document } from "./pieces";

export default { catalog, registry, store, document };
`;

const writeProject = async (config: string, extension = "ts"): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), "nubbin-cli-load-"));
  await writeFile(join(root, `pieces.${extension}`), PIECES);
  await writeFile(join(root, `nubbin.config.${extension}`), config);
  return join(root, `nubbin.config.${extension}`);
};

// A block definition carries its component beside its schema, so reaching a consumer's registry
// means parsing JSX. Nothing here imports React and nothing needs to: the transform emits a call
// that is only reached by rendering, which the CLI never does.
const COMPONENT = `
export const Hero = () => <section data-block="Hero">live</section>;
export const version = 1;
`;

const CONFIG_WITH_COMPONENT = `
import { Hero, version } from "./Hero";

export default {
  catalog: {}, registry: { get: () => ({ component: Hero, version }) }, store: {},
  document: (route) => ({ route }),
};
`;

describe("loadConfig", () => {
  test("loads a config that reaches a block's component, JSX and all", async () => {
    const root = await mkdtemp(join(tmpdir(), "nubbin-cli-jsx-"));
    await writeFile(join(root, "Hero.tsx"), COMPONENT);
    const path = join(root, "nubbin.config.ts");
    await writeFile(path, CONFIG_WITH_COMPONENT);
    expect(await loadConfig(path)).toHaveProperty("registry");
  });

  test("loads a TypeScript config whose imports are extensionless", async () => {
    const config = await loadConfig(await writeProject(CONFIG));
    expect(config.document("/pricing")).toEqual({ route: "/pricing" });
  });

  test("loads a JavaScript config too", async () => {
    const config = await loadConfig(await writeProject(CONFIG, "js"));
    expect(config.document("/pricing")).toEqual({ route: "/pricing" });
  });

  test("refuses a config that default-exports nothing, naming the file", async () => {
    const path = await writeProject("export const catalog = {};");
    await expect(loadConfig(path)).rejects.toThrow(/nubbin\.config\.ts/);
  });

  test("refuses a config missing a field, naming the field", async () => {
    const path = await writeProject("export default { catalog: {}, registry: {}, store: {} };");
    await expect(loadConfig(path)).rejects.toThrow(/document/);
  });
});
