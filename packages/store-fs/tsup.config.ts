import { defineConfig } from "tsup";

// Two entries: the store a consumer installs, and the contract suite an implementer runs against
// their own. The suite calls into vitest, which is why the package declares it as an optional
// peer — importing `@nubbin/store-fs` needs nothing, and importing `@nubbin/store-fs/testing`
// needs a runner the consumer already has.
export default defineConfig({
  entry: ["src/index.ts", "src/testing/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
