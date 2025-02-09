import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark } from '../benchmarksCommon';

export class BenchBulkDataPush extends CPUBenchmark {
  constructor(private options: {
    count: number;
    interval: number;
    total: number;
  }) {
    super({
      id: Benchmark._06 + `${options.count}-${options.interval}-${options.total}`,
      label: '06_bulk_data_push',
      description: 'websocket push all data, 10 nums per ms',
      fileName: Benchmark._06
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'fpsStart');
    await this.evaluateWebHelper(page, 'startBulkDataPush', this.options);
    const { result } = await this.evaluateWebHelper(page, 'fpsStop');
    await this.evaluateWebHelper(page, 'stopWebsocket');
    return result;
  }
}
