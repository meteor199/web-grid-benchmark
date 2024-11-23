// types.ts
interface GridData {
  name: string;
  memoryUsed: string;
}

// index.ts
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  createGrid,
  GridOptions,
  ValueFormatterParams,
} from 'ag-grid-community';

// Initialize Grid after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Grid configuration
  const gridOptions: GridOptions<GridData> = {
    columnDefs: [
      {
        field: 'name',
        headerName: 'Library Name',
        sortable: true,
        flex: 1,
      },
      {
        field: 'memoryUsed',
        headerName: 'Memory Usage',
        sortable: true,
        flex: 1,
        valueFormatter: (params: ValueFormatterParams) => {
          const memoryInMB = (parseInt(params.value) / (1024 * 1024)).toFixed(
            2
          );
          return `${memoryInMB} MB`;
        },
      },
    ],
  };

  // Create the grid
  const gridDiv = document.querySelector<HTMLElement>('#myGrid');
  if (!gridDiv) {
    throw new Error('Grid container not found');
  }

  // Initialize the grid
  const grid = createGrid(gridDiv, gridOptions);

  // Load data
  loadGridData().then((data) => {
    grid.setGridOption('rowData', data);
  });
});

// Data loading function
async function loadGridData(): Promise<GridData[]> {
  try {
    const response = await fetch('./result.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to load data: ${(error as Error).message}`);
  }
}
