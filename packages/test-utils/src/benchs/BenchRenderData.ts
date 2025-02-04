import { Page } from 'playwright';
import { CPUBenchmark } from '../CPUBenchmark';
import { Benchmark, BenchmarkOptions, GridData } from '../benchmarksCommon';
import { SCREENSHOT_DIR } from '../constants';

export class BenchRenderData extends CPUBenchmark {
  constructor() {
    super({
      id: Benchmark._01,
      label: 'render data',
      description: 'render 100K rows.',
    });
  }
  async init(page: Page) {
    await this.evaluateWebHelper(page, 'init');
  }
  async run(page: Page) {
    await this.evaluateWebHelper(page, 'renderData');
  }

  public async afterRun(
    page: Page,
    gridData: GridData,
    benchOptions: BenchmarkOptions
  ) {
    //
    const filePath = `${SCREENSHOT_DIR}/${gridData.name}_${benchOptions.iterationNumber}.png`;
    await page.screenshot({ path: filePath });
  }
}
