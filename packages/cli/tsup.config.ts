import { defineConfig } from "tsup";

// Three entries: the library half a config file imports, the executable the `bin` field names, and
// the plan contract a browser imports. Types are emitted for the two libraries — nothing imports
// the executable.
export default defineConfig({
  entry: ["src/index.ts", "src/bin.ts", "src/plan/index.ts"],
  format: ["esm"],
  dts: { entry: ["src/index.ts", "src/plan/index.ts"] },
  clean: true,
});
