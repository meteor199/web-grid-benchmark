import { GridApi, GridOptions, createGrid } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  generateGridData,
  getColumns,
  wait,
  BaseBenchmarkHelper,
  WaitForInfo,
  WaitForType,
  registerBenchmarkHelper,
} from '@web-grid-benchmark/core';

const columnDefs = getColumns().map((item) => {
  return {
    field: item.field,
    headerName: item.header,
    width: item.width,
    // flex: item.flex,
  };
});

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: [],
};

let gridApi: GridApi<any>;
let gridData: any[] = [];
document.addEventListener('DOMContentLoaded', async () => {
  const eGridDiv = document.querySelector<HTMLElement>('#myGrid')!;
  gridData = await generateGridData(10000);
  gridApi = createGrid(eGridDiv, gridOptions);
  await wait();
});

@registerBenchmarkHelper
export class BenchmarkHelper extends BaseBenchmarkHelper {
  public async init() {
    return {
      type: WaitForType.Selector,
      selector: '.ag-body-viewport',
    };
  }

  public async renderData(): Promise<WaitForInfo | void> {
    gridApi.setGridOption('rowData', gridData);
    await wait();
  }
}
