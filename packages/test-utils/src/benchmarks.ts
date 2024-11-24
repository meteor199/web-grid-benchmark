import { Page } from 'playwright';
import {
  Benchmark,
  BenchmarkImpl,
  BenchmarkType,
  CPUBenchmarkInfo,
  FrameworkData,
} from './benchmarksCommon';
import {
  BaseBenchmarkHelper,
  WaitForInfo,
  WaitForType,
  WINDOW__BENCHMARK_HELPER,
} from '@web-grid-benchmark/core';

export abstract class CPUBenchmark implements BenchmarkImpl {
  type = BenchmarkType.CPU;

  constructor(public benchmarkInfo: CPUBenchmarkInfo) {}
  abstract init(page: Page, framework: FrameworkData): Promise<any>;
  abstract run(page: Page, framework: FrameworkData): Promise<any>;

  public async evaluateWebHelper(
    page: Page,
    methodName: keyof BaseBenchmarkHelper
  ): Promise<WaitForInfo> {
    const result = await page.evaluate(
      ([methodName, keyName]) => {
        return (window as any)[keyName][methodName]();
      },
      [methodName, WINDOW__BENCHMARK_HELPER]
    );
    return result;
  }
}

export class BenchRenderData extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._01,
      label: 'render data',
      warmupCount: 5,
      description: 'render 100K rows.',
      type: BenchmarkType.CPU,
      allowBatching: true,
      layoutEventRequired: true,
      additionalNumberOfRuns: 0,
    });
  }
  async init(page: Page) {
    const initResult = await this.evaluateWebHelper(page, 'init');
    switch (initResult.type) {
      case WaitForType.Selector:
        await page.waitForSelector(initResult.selector!);
        break;
      default:
        throw new Error('Unknown wait type');
    }
  }
  async run(page: Page) {
    const result = await this.evaluateWebHelper(page, 'renderData');
    if (result) {
      switch (result.type) {
        case WaitForType.Selector:
          await page.waitForSelector(result.selector!);
          break;
        default:
        //
      }
    }
  }
}
