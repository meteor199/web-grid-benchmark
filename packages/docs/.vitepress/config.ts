import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Web Grid Benchmark',
  description: 'Performance benchmarks for web grid components',
  base: '/web-grid-benchmark/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/meteor199/web-grid-benchmark' }
    ]
  }
})
