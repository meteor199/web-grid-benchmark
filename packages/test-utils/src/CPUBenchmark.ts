import { Page } from 'playwright';
import {
  Benchmark,
  BenchmarkImpl,
  BenchmarkOptions,
  BenchmarkType,
  CPUBenchmarkInfo,
  GridData,
} from './benchmarksCommon';
import {
  BaseBenchmarkHelper,
  WaitForInfo,
  WaitForType,
  WINDOW__BENCHMARK_HELPER,
} from '@web-grid-benchmark/core';

export abstract class CPUBenchmark implements BenchmarkImpl {
  type = BenchmarkType.CPU;

  constructor(public benchmarkInfo: CPUBenchmarkInfo) { }
  abstract init(page: Page): Promise<any>;
  abstract run(page: Page): Promise<any>;

  public async afterRun(
    page: Page,
    gridData: GridData,
    benchOptions: BenchmarkOptions
  ) {
    //
  }

  public async evaluateWebHelper(
    page: Page,
    methodName: keyof BaseBenchmarkHelper,
    param?: any,
  ) {
    const result = await page.evaluate(
      ([methodName, keyName, param]) => {
        return (window as any)[keyName][methodName](param);
      },
      [methodName, WINDOW__BENCHMARK_HELPER, param]
    );

    if (result?.type) {
      switch (result.type) {
        case WaitForType.Selector:
          await page.waitForSelector(result.selector!);
          break;
        default:
          throw new Error('Unknown wait type');
      }
    }

    return result;
  }
}
