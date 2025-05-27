import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: true,
});
