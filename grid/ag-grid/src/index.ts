import { GridOptions, createGrid } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { generateGridData, getColumns, wait } from '@web-grid-benchmark/core';

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

document.addEventListener('DOMContentLoaded', async () => {
  const eGridDiv = document.querySelector<HTMLElement>('#myGrid')!;

  const data = await generateGridData(10000);
  const api = createGrid(eGridDiv, gridOptions);

  api.setGridOption('rowData', data);

  await wait();

  (window as any).setData = 1;
});
