import { defineConfig } from 'vite';

export default defineConfig({
  base: '/web-grid-benchmark/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
