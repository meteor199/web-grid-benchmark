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
  type: BenchmarkType;
}
export interface BenchmarkImpl {
  benchmarkInfo: BenchmarkInfoBase;
  type: BenchmarkType;
}

export interface CPUBenchmarkInfo extends BenchmarkInfoBase {
  allowBatching: boolean;
  type: BenchmarkType.CPU;
  layoutEventRequired: boolean;
  additionalNumberOfRuns: number;
  warmupCount: number;
}

export enum Benchmark {
  _01 = '01_render_100K_rows',
  _02 = '02_scroll_10_times',
}

export type BenchmarkId = typeof Benchmark._01 | typeof Benchmark._02;

export interface FrameworkData {
  name: string;
  fullNameWithKeyedAndVersion: string;
  uri: string;
  keyed: boolean;
  useShadowRoot: boolean;
  useRowShadowRoot: boolean;
  shadowRootName: string | undefined;
  buttonsInShadowRoot: boolean;
  issues: number[];
  frameworkHomeURL: string;
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
