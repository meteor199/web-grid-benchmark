export interface GridData {
  name: string;
  ['01_render_100K_rows']: string;
  ['02_scroll']: string;
  ['03_sort']: string;
  ['04_filter']: string;
  ['05_push']: string;
}

export interface BenchmarkResult {
  /**  */
  name: string;
  /** ID */
  benchId: string;
  /**  */
  iterationNumber: number;
  /** (ms) */
  duration: number;
  /** (MB) */
  memoryStart: number;
  /** (MB) */
  memoryEnd: number;
  /** CPU(ms) */
  totalCPUTime: number;
  /** FPS */
  fps?: number;
}

export interface MetricData {
  values: number[];
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  median: number;
}

export interface Metric {
  label: string;
  data: Record<string, MetricData>;
}

export interface ProcessedData {
  combinations: string[];
  metrics: {
    duration: Metric;
    memoryIncrement: Metric;
    totalCPUTime: Metric;
    fps?: Metric;
  };
  summaryData: BenchmarkSummary[];
}

export interface BenchmarkSummary {
  name: string;
  benchId: string;
  runCount: number;
  duration: StatsSummary;
  memoryIncrement: StatsSummary;
  memoryStart: StatsSummary;
  memoryEnd: StatsSummary;
  totalCPUTime: StatsSummary;
  fps: StatsSummary;
}

export interface StatsSummary {
  mean: string;
  stdDev: string;
  min: string;
  max: string;
  median: string;
}