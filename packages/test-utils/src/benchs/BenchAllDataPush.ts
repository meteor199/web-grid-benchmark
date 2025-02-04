import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';
import { wait } from '@web-grid-benchmark/core';

export class BenchAllDataPush extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._06,
      label: '06_all_data_push',
      description: 'websocket push all data, 10 nums per ms',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'fpsStart');
    await this.evaluateWebHelper(page, 'startAllDataPush');
    const { result } = await this.evaluateWebHelper(page, 'fpsStop');
    await this.evaluateWebHelper(page, 'stopWebsocket');
    return result;
  }
}
