import { ColDef, GridApi, GridOptions, createGrid } from 'ag-grid-community';
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
  testScrollElement,
  startWs,
  EmployeeModel,
  GRID_CONFIG,
  GRID_CONFIG_STYLE_COL,
  getDepartmentColor,
  GRID_CONFIG_PERCENTAGE_COL,
  GRID_CONFIG_ICON_COL,
} from '@web-grid-benchmark/core';

const columnDefs: ColDef[] = getColumns().map((item) => {
  const col: ColDef = {
    field: item.field,
    headerName: item.header,
    width: item.width,
    sortable: item.sortable || false,
    filter: item.filterable || false,
    pinned: item.pinned ? 'left' : undefined,
  };
  if (col.field === GRID_CONFIG_STYLE_COL) {
    col.cellStyle = (params) => {
      return {
        backgroundColor: getDepartmentColor(params.value),
      };
    };
  }


  if (col.field === GRID_CONFIG_PERCENTAGE_COL) {
    col.cellRenderer = (params: any) => {
      const performance = params.value;
      const percentage = (performance * 100).toFixed(0) + '%';

      return `
        <div style="width: 100%; background-color: #e0e0e0; border-radius: 4px;">
          <div style="
            width: ${percentage}; 
            background-color: ${performance < 0.3 ? '#ff6b6b' :   // 
          performance < 0.7 ? '#4ecdc4' :   // 
            '#45b7d1'                         // 
        }; 
            height: 20px; 
            border-radius: 4px;
            text-align: left;
            color: white;
            line-height: 20px;
          ">
            ${params.value}
          </div>
        </div>
      `;
    };
  }


  if (col.field === GRID_CONFIG_ICON_COL) {
    col.cellRenderer = (params: any) => {
      const name = params.value;
      const firstLetter = name.charAt(0).toUpperCase();

      return `
    <div>
      <span style="
        width: 20px; 
        height: 20px; 
        border-radius: 50%; 
        background-color: #007bff;
        color: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
      ">
        ${firstLetter}
      </span>
      <span>${name}</span>
    </div>
  `;
    };
  }
  return col;
});

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowHeight: GRID_CONFIG.rowHeight,
  rowData: [],
  getRowId: (item) => {
    return item.data.id;
  },
};

let gridApi: GridApi<any>;
let gridData: EmployeeModel[] = [];
document.addEventListener('DOMContentLoaded', async () => {
  const eGridDiv = document.querySelector<HTMLElement>('#grid-container')!;
  gridApi = createGrid(eGridDiv, gridOptions);
  await wait();
});

@registerBenchmarkHelper
export class BenchmarkHelper extends BaseBenchmarkHelper {
  public async init() {
    gridData = await generateGridData();

    return {
      type: WaitForType.Selector,
      selector: '.ag-body-viewport',
    };
  }

  public async renderData(): Promise<WaitForInfo | void> {
    gridApi.setGridOption('rowData', gridData);
    await wait(1);
  }

  public async scroll() {
    await testScrollElement({
      element: document.querySelector('.ag-body-viewport')!,
    });
  }

  public async sort() {
    gridApi!.applyColumnState({
      state: [{ colId: 'name', sort: 'asc' }],
      defaultState: { sort: null },
    });
    await wait(1);
  }

  public async filter() {
    gridApi!.setFilterModel({
      department: {
        filterType: 'text',
        type: 'contains',
        filter: 'Engineering',
      },
    });

    await wait(1);
  }
  public async startWebsocket() {
    await startWs(undefined, (data) => {
      gridApi.applyTransaction({
        add: [],
        addIndex: 0,
        update: data,
      });
    });
  }
}
