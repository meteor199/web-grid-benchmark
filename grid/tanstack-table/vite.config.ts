import { defineConfig } from 'vite';
import { createGridViteConfig } from '@web-grid-benchmark/core/config/viteConfig';
import react from '@vitejs/plugin-react';

export default defineConfig({
  ...createGridViteConfig({
    gridName: 'tanstack-table'
  }),
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { legacy: true }]
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
  },
});
