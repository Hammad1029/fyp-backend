import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts", "prisma/seed.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: true,
});
