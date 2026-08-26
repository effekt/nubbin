import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/defineStudioConfig.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
