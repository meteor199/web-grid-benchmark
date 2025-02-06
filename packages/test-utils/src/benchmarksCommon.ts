export enum BenchmarkType {
  CPU,
  MEM,
  STARTUP_MAIN,
  STARTUP,
  SIZE_MAIN,
  SIZE,
}

export interface BenchmarkInfoBase {
  id: string;
  label: string;
  description: string;
  type?: BenchmarkType;
}
export interface BenchmarkImpl {
  benchmarkInfo: BenchmarkInfoBase;
  type: BenchmarkType;
}

export interface BenchmarkResult {
  step: string;
  duration: number;
  memoryUsed: number;
  fps: number | null;
  result: any;
}
export interface CPUBenchmarkInfo extends BenchmarkInfoBase {
  allowBatching?: boolean;
  type?: BenchmarkType.CPU;
  layoutEventRequired?: boolean;
  additionalNumberOfRuns?: number;
  warmupCount?: number;
}

export enum Benchmark {
  _01 = '01_render_100K_rows',
  _02 = '02_scroll',
  _03 = '03_sort',
  _04 = '04_filter',
  _05 = '05_push',
  _06 = '06_all_data_push',

}

export type BenchmarkId = typeof Benchmark._01 | typeof Benchmark._02;

export interface GridData {
  name: string;
  urlPrefix: string;
}

const throttlingFactors: { [idx: string]: number } = {
  // [Benchmark._03]: 4,
};

export function slowDownFactor(
  benchmarkId: string,
  allowThrottling: boolean
): number | undefined {
  if (!allowThrottling) return undefined;
  return throttlingFactors[benchmarkId];
}

/**
 * Options for configuring benchmark tests
 */
export interface BenchmarkOptions {
  /** Grid URL for the benchmark test */
  url: string;

  /** 
   * Current iteration number of the benchmark
   * @example 1, 2, 3, ...
   */
  iterationNumber: number;

  /** 
   * Whether to disable GPU acceleration
   * When enabled, uses software rendering mode (SwiftShader)
   * @default false
   */
  disableGPU?: boolean;

  /** 
   * CPU throttling factor to simulate slower devices
   * - 1: Normal speed
   * - 2: 1/2 speed
   * - 4: 1/4 speed
   * - 6: 1/6 speed
   * @default undefined No CPU throttling
   */
  cpuSlowdownFactor?: number;
  /**
   * Keep browser window open after test completion
   * Useful for debugging and visual inspection
   * @default false Auto-close window after test
   */
  keepWindowOpen?: boolean;
  /**
   * Whether to record performance trace logs
   */
  enableTraceLog?: boolean;
}
