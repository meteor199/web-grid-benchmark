import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';

export class BenchScroll extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._02,
      label: '02_scroll',
      description: 'scroll test.',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
    await this.evaluateWebHelper(page, 'renderData');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'fpsStart');
    await this.evaluateWebHelper(page, 'scroll');
    const { result } = await this.evaluateWebHelper(page, 'fpsStop');
    return result;
  }
}
