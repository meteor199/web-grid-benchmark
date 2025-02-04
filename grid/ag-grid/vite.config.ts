import { defineConfig } from 'vite';
import { createGridViteConfig } from '@web-grid-benchmark/core/config/viteConfig';

export default defineConfig(createGridViteConfig({
  gridName: 'ag-grid'
}));
