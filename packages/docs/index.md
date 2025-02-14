# Web Grid 性能基准测试

对比各个表格的性能，包括AG Grid、TanStack Table等主流表格组件，通过统一的基准测试来评估它们在不同场景下的性能表现。

## 测试环境
- 操作系统：Windows 11
- 内存：32GB
- CPU：AMD R5 3600
- GPU：AMD Radeon RX 580 2048SP
- 浏览器：Chromium 131.0.6778.33
- 测试框架：Playwright 

## 基准测试项目

- [渲染性能测试](./benchs/render-benchmark.md) - 测试表格组件渲染大量数据的性能
- [滚动性能测试](./benchs/scroll-benchmark.md) - 测试表格组件的滚动性能和流畅度
- [排序性能测试](./benchs/sort-benchmark.md) - 测试表格组件的数据排序性能
- [过滤性能测试](./benchs/filter-benchmark.md) - 测试表格组件的数据过滤性能
- [数据推送测试](./benchs/bulk-push-benchmark.md) - 测试表格组件处理实时数据更新的性能