// index.ts
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  createGrid,
  GridOptions,
  ValueFormatterParams,
} from 'ag-grid-community';
import "ag-grid-enterprise";
import { BenchmarkResult, BenchmarkSummary, MetricData, Metric, ProcessedData, StatsSummary, GridData } from './types';
import { loadData, quantile, calculateStats, processData } from './utils';


// Initialize Grid after DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  const data = await loadData('./result.json');
  console.log(data);
  // // Create chart
  // const chartConfig = createChartConfig(data.metrics.duration, data.combinations);
  // const ctx = document.getElementById('chart')!.getContext('2d');
  // new Chart(ctx, chartConfig);

  // Create grid
  const gridOptions: GridOptions<BenchmarkSummary> = {
    rowHeight: 24,
    columnDefs: [
      {
        field: 'name',
        headerName: 'Grid',
        sortable: true,
        filter: true,
        width: 130,
        enableRowGroup: true,
        rowDrag: true
      },
      {
        field: 'benchId',
        headerName: 'Benchmark',
        sortable: true,
        filter: true,
        width: 150,
        enableRowGroup: true,
        rowGroup: true, // Enable grouping by default
        hide: true, // Hide the column since it's grouped
      },
      
      {
        headerName: 'Total CPU Time (ms)',
        marryChildren: true,
        children: [
          {
            field: 'totalCPUTime.mean',
            headerName: 'Mean',
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'totalCPUTime.stdDev',
            headerName: 'Std Dev',
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
        ]
      },
      {
        headerName: 'Duration (ms)',
        marryChildren: true,  // 
        hide: true,
        children: [
          {
            field: 'duration.mean',
            headerName: 'Mean',
            hide: true,
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true, // ,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'duration.stdDev',
            headerName: 'Std Dev',
            hide: true,
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
        ]
      },
      {
        headerName: 'Memory Start (MB)',
        marryChildren: true,
        children: [
          {
            field: 'memoryStart.mean',
            headerName: 'Mean',
            hide: true,
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'memoryStart.stdDev',
            headerName: 'Std Dev',
            hide: true,
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          }
        ]
      },
      {
        headerName: 'Memory Used (MB)',
        marryChildren: true,
        children: [
          {
            field: 'memoryEnd.mean',
            headerName: 'Mean',
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'memoryEnd.stdDev',
            headerName: 'Std Dev',
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          }
        ]
      },
      {
        headerName: 'Memory Increment (MB)',
        marryChildren: true,
        children: [
          {
            field: 'memoryIncrement.mean',
            hide: true,
            headerName: 'Mean',
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'memoryIncrement.stdDev',
            headerName: 'Std Dev',
            hide: true,
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
        ]
      },
      {
        headerName: 'FPS',
        marryChildren: true,
        children: [
          {
            field: 'fps.mean',
            headerName: 'Mean',
            valueFormatter: (params) => params.value ? `${parseFloat(params.value).toFixed(2)}` : 'N/A',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
          {
            field: 'fps.stdDev',
            headerName: 'Std Dev',
            valueFormatter: (params) => params.value ? `±${parseFloat(params.value).toFixed(2)}` : '',
            width: 120,
            enableValue: true,
            cellStyle: { textAlign: 'right' },
            type: "numericColumn",
            comparator: (valueA, valueB) => {
              return (valueA || 0) - (valueB || 0);
            }
          },
        ]
      }
    ],
    defaultColDef: {
      resizable: true,
      sortable: true,
      // filter: true,
      enableRowGroup: true,  // 
      enablePivot: true     // 
    },
    groupDefaultExpanded: -1, // Expand all groups by default (-1 means all levels)
    rowData: data.summaryData,
    // domLayout: 'autoHeight',  // 
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
    headerHeight: 48,
    groupHeaderHeight: 48,

    // 
    groupDisplayType: 'multipleColumns',  // 
    rowGroupPanelShow: 'always',         // 
    suppressDragLeaveHidesColumns: true, // 

    // 
    enableRangeSelection: true,
    rowDragManaged: true,
    animateRows: true,

    // 
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
      ],
    },
  };

  const gridDiv = document.querySelector<HTMLElement>('#myGrid');
  if (!gridDiv) {
    throw new Error('Grid container not found');
  }

  const grid = createGrid(gridDiv, gridOptions);
});