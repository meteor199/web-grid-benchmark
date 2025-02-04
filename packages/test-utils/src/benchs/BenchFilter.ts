import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';

export class BenchFilter extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._04,
      label: '04_filter',
      description: 'filter test.',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
    await this.evaluateWebHelper(page, 'renderData');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'filter');
  }
}
