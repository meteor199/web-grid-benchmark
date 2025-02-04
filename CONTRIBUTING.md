## Development Environment Setup

To set up the development environment, follow these steps:

```sh
# prepare the environment
git clone https://github.com/meteor199/web-grid-benchmark
cd web-grid-benchmar
pnpm install
pnpm run prepare-env

# Run the test server
cd packages/test-utils
pnpm run server

# Test a grid (e.g., ag-grid) in a new terminal
cd grid/ag-grid
pnpm run dev

# Run the benchmark in a new terminal
cd packages/test-utils
pnpm run dev
```

## Adding a Grid Component

When adding a grid component, follow these steps:

- [ ] Implement the `BaseBenchmarkHelper` class
- Configure basic grid settings:
  - [ ] Set the line height
  - [ ] Set the grid dimensions (width and height)
  - [ ] Set the column width
  - [ ] Set the pinned columns
- Implement custom column features:
  - [ ] A column with custom icon rendering
  - [ ] A column with custom progress bar visualization
  - [ ] A column with dynamic background colors based on data values
- [ ] Add a build script to the npm configuration
