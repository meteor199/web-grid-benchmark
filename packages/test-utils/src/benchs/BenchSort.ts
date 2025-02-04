import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';

export class BenchSort extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._03,
      label: '03_sort',
      description: 'sort test.',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
    await this.evaluateWebHelper(page, 'renderData');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'sort');
  }
}
