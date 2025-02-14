import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Web Grid Benchmark',
  description: 'Performance benchmarks for web grid components',
  base: '/web-grid-benchmark/',
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],
    sidebar: [
      {
        text: '简介',
        link: '/' 
      },
      {
        text: '基准测试',
        items: [
          { text: '渲染测试', link: '/benchs/render-benchmark' },
          { text: '滚动测试', link: '/benchs/scroll-benchmark' },
          { text: '排序测试', link: '/benchs/sort-benchmark' },
          { text: '过滤测试', link: '/benchs/filter-benchmark' },
          { text: '数据推送测试', link: '/benchs/bulk-push-benchmark' },
        ],
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/meteor199/web-grid-benchmark',
      },
    ],
  },
});
