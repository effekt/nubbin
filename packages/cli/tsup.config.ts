import { defineConfig } from "tsup";

// Two entries: the library half a config file imports, and the executable the bin field names.
// Types are emitted for the library only — nothing imports the executable.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: { entry: "src/index.ts" },
  clean: true,
});
