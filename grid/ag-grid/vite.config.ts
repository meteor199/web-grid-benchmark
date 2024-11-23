import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../../dist/ag-grid',
    emptyOutDir: true,
  },
});
