import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/useDraftSave.ts",
    "src/useEditorStatus.ts",
    "src/ConsumerOriginContext.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
});
