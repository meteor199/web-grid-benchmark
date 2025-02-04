import * as VTable from '@visactor/vtable';
import { ICustomRenderElement } from '@visactor/vtable/es/ts-types';

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
  GRID_CONFIG_ICON_COL,
  GRID_CONFIG_PERCENTAGE_COL,
  getDepartmentColor,
} from '@web-grid-benchmark/core';

let gridData: EmployeeModel[] = [];

let tableInstance: VTable.ListTable;

const option: VTable.TYPES.ListTableConstructorOptions = {
  records: [],
  columns: getColumns().map((item) => {
    const col: VTable.ColumnDefine = {
      field: item.field,
      title: item.header,
      width: item.width,
      // sortable: item.sortable || false,
      // filter: item.filterable || false,
    };



    if (item.field === GRID_CONFIG_PERCENTAGE_COL) {
      col.customRender = (args) => {
        const { value } = args;
        const rect = args.rect!;
        const percentage = value * 100;
        const barWidth = rect.width - 20; // 
        const barHeight = 16;
        const progressWidth = (barWidth * percentage) / 100;

        const elements:ICustomRenderElement[] = [
          // 
          {
            type: 'rect',
            fill: '#e0e0e0',
            x: 10,
            y: (rect.height - barHeight) / 2,
            width: barWidth,
            height: barHeight,
            radius: 4 // 
          },
          // 
          {
            type: 'rect',
            fill: value < 0.3 ? '#ff6b6b' :
              value < 0.7 ? '#4ecdc4' :
                '#45b7d1',
            x: 10,
            y: (rect.height - barHeight) / 2,
            width: progressWidth,
            height: barHeight,
            radius: 4
          },
          // 
          {
            type: 'text',
            text: percentage.toFixed(0) + '%',
            fill: 'white',
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'left',
            textBaseline: 'middle',
            x: 10,
            y: rect.height / 2
          }
        ];

        return {
          elements,
          expectedHeight: rect.height,
          expectedWidth: rect.width
        };
      }
    }

    // 
    if (item.field === GRID_CONFIG_ICON_COL) {
      col.customRender = (args) => {

        const { value } = args;
        const rect = args.rect!;
        const firstLetter = value.charAt(0).toUpperCase();
        const iconSize = 20;
        const iconMargin = 10;

        const elements:ICustomRenderElement[] = [
          // 
          {
            type: 'circle',
            fill: '#007bff',
            x: iconMargin + iconSize / 2,
            y: rect.height / 2,
            radius: iconSize / 2
          },
          // 
          {
            type: 'text',
            text: firstLetter,
            fill: 'white',
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            textBaseline: 'middle',
            x: iconMargin + iconSize / 2,
            y: rect.height / 2
          },
          // 
          {
            type: 'text',
            text: value,
            fill: '#333333',
            fontSize: 14,
            textAlign: 'left',
            textBaseline: 'middle',
            x: iconMargin * 2 + iconSize,
            y: rect.height / 2
          }
        ];

        return {
          elements,
          expectedHeight: rect.height,
          expectedWidth: rect.width
        };
      };
    }

    // 
    if (item.field === GRID_CONFIG_STYLE_COL) {
      col.style = {
        bgColor: (args) => {
          const { value } = args;
          return getDepartmentColor(value);
        }
      };
    }
    return col;
  }),
  widthMode: 'standard',
  frozenColCount: getColumns().filter((item) => item.pinned).length,

  canvasWidth: GRID_CONFIG.gridWidth,
  canvasHeight: GRID_CONFIG.gridHeight,
  defaultRowHeight: GRID_CONFIG.rowHeight,
};
document.addEventListener('DOMContentLoaded', async () => {
  const eGridDiv = document.querySelector<HTMLElement>('#myGrid')!;

  tableInstance = new VTable.ListTable(eGridDiv, option);
});

@registerBenchmarkHelper
export class BenchmarkHelper extends BaseBenchmarkHelper {
  public async init() {
    gridData = await generateGridData();
    await wait(1);
  }

  public async renderData(): Promise<WaitForInfo | void> {
    tableInstance.setRecords(gridData);
    await wait(1);
  }

  public async scroll() {
    await testScrollElement({
      scrollFn: (scrollTop: number) => tableInstance.setScrollTop(scrollTop),
    });
  }

  public async sort() {
    tableInstance.updateSortState({
      field: 'name',
      order: 'desc',
    });
    await wait(1);
  }

  public async filter() {
    await tableInstance.updateFilterRules([
      {
        filterKey: 'department',
        filteredValues: ['Engineering'],
      },
    ]);
    await wait(1);
  }
  public async startWebsocket() {
    const map = new Map();
    gridData.forEach((item) => {
      map.set(item.id, item);
    });

    await startWs(undefined, (data) => {
      data.forEach((item) => {
        if (map.has(item.id)) {
          Object.assign(map.get(item.id), item);
        }
      });
      tableInstance.setRecords(gridData);
    });
  }
}
