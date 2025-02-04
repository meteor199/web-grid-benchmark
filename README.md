# **web-grid-benchmark**

A comprehensive benchmark analysis of web-based grid/table components, comparing performance across popular libraries and frameworks.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`web-grid-benchmark` provides detailed performance comparisons of popular web table/grid libraries. Our goal is to help developers make informed decisions when choosing table components for their projects, especially for large-scale data visualization needs.

## Benchmark Results

https://meteor199.github.io/web-grid-benchmark/

## Test Environment

All benchmarks are conducted under the following conditions:

- Chrome 120
- 32GB RAM
- Node.js 20.x

## Run Locally

Want to verify our results? Clone and run the benchmarks locally:

```bash
# prepare the environment
git clone https://github.com/meteor199/web-grid-benchmark
cd web-grid-benchmark
pnpm i
pnpm run prepare-env

# run the benchmark
pnpm run build
pnpm run bench
```


## Roadmap

- 📊 Interactive performance comparison charts
- 更准确的测试结果
- 更多的表格支持
- 完善更多的测试场景
- 🔄 Weekly automated benchmark updates
- 📈 Performance trend analysis

## Contributing

Help us expand our benchmark coverage:

1. Add new table libraries
2. Contribute test scenarios
3. Verify results on different devices
4. Improve measurement methodology

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

⭐ Star this repo to stay updated with the latest benchmark results!

---
