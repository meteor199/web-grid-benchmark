import { defineConfig, mergeConfig } from 'vite';
import { createGridViteConfig } from '@web-grid-benchmark/core/config/viteConfig';
import vue from '@vitejs/plugin-vue';
export default defineConfig(
  mergeConfig(
    {
      plugins: [vue()],
    },
    createGridViteConfig({
      gridName: 'vxe-table'
    })
  )
);
