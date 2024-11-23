export interface ColumnDefinition {
  field: string;
  header: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'currency' | 'percentage';
  width?: number;
  flex?: number;
  format?: string;
}

export interface GridData {
  rows: number;
  columns: number;
  data: any[][];
}

export interface GridBenchmarkOptions {
  iterations?: number;
  dataSize?: {
    rows: number;
    columns: number;
  };
}

export interface GridBenchmarkSuite {
  name: string;
  tests: GridBenchmarkTest[];
}

export interface GridBenchmarkTest {
  name: string;
  fn: (data: GridData) => void;
}