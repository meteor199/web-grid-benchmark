import {
  generateGridData,
  getColumns,
  wait,
  BaseBenchmarkHelper,
  WaitForInfo,
  WaitForType,
  registerBenchmarkHelper,
  testScrollElement,
  startWs,
  EmployeeModel,
  GRID_CONFIG,
} from '@web-grid-benchmark/core';

import { TableApi } from './TableApi';

let tableApi: TableApi;
let gridData: EmployeeModel[] = [];

async function init() {
  // Create canvas element
  const gridContainer = document.querySelector<HTMLElement>('#grid-container')!;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    width: 100%;
    height: 500px;
    border: 2px solid gray;
    margin: 0;
    overflow: hidden;
    display: block;
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -ms-interpolation-mode: nearest-neighbor;
  `;
  gridContainer.appendChild(canvas);

  tableApi = new TableApi();
  const [, data] = await Promise.all([tableApi.render(canvas), generateGridData()]);
  gridData = data;

  await Promise.all([tableApi.init(), tableApi.set_temp_data(data)]);

  console.log('init done');
}

let initPromise: Promise<void> | undefined;

// Initialize grid when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  initPromise = init();
});

// Register benchmark helper
@registerBenchmarkHelper
export class ImGuiBenchmarkHelper extends BaseBenchmarkHelper {
  public async init() {
    await initPromise;
    console.log("init success");
  }

  public async renderData(): Promise<WaitForInfo | void> {
    tableApi.setData();
    await wait(1);
  }

  public async scroll() {
    await testScrollElement({
      scrollFn: (scrollTop: number) => tableApi.setScrollTop(scrollTop),
    });
  }

  public async sort() {
    tableApi.sortData('name', true);
    await wait(1);
  }

  public async filter() {
    tableApi.filterData('department', 'contains', 'Engineering');
    await wait(1);
  }

  public async startWebsocket() {
    await startWs(undefined, (data) => {
      tableApi.updateData(data);
    });
  }

  protected async insertData(data: EmployeeModel[]) {
    tableApi.insertData(data);
    await wait(1);
  }
}