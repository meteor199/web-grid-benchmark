export abstract class BaseBenchmarkHelper {
  public abstract init(): Promise<WaitForInfo | void>;
  public abstract renderData(): Promise<WaitForInfo | void>;
}

export const WINDOW__BENCHMARK_HELPER = '__BENCHMARK_HELPER__';

export interface WaitForInfo {
  type: WaitForType;
  selector?: string;
}
export enum WaitForType {
  Selector = 'selector',
}

export function registerBenchmarkHelper<T extends { new (): BaseBenchmarkHelper }>(
  target: T
) {
  const instance = new (target as any)();
  (window as any)[WINDOW__BENCHMARK_HELPER] = instance;
}
