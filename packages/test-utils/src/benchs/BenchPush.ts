import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';
import { wait } from '@web-grid-benchmark/core';

export class BenchPush extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._05,
      label: '05_push',
      description: 'websocket push test.',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
    await this.evaluateWebHelper(page, 'renderData');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'startWebsocket');
    await this.evaluateWebHelper(page, 'fpsStart');
    await wait(5000);
    const { result } = await this.evaluateWebHelper(page, 'fpsStop');
    await this.evaluateWebHelper(page, 'stopWebsocket');
    return result;
  }
}
