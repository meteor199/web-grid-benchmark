import { chromium, Page } from 'playwright';

interface BenchmarkResult {
  step: string;
  duration: number;
  memoryUsed: number;
  fps: number | null;
  result: any;
}

export class Benchmark {
  private url: string;
  private results = {
    memoryUsed: 0,
  };

  constructor(url: string) {
    this.url = url; // URL of the page to benchmark
  }

  async run(): Promise<Record<string, any>> {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
      console.log('Launching browser and navigating to the page...');
      await page.goto(this.url);

      await page.waitForFunction(() => (window as any).setData === 1);

      this.results.memoryUsed = await this.getMemoryUsage(page);
      // Execute benchmark steps
      // this.results.openPage = await this.recordMetrics(page, 'openPage');
      // this.results.showGrid = await this.recordMetrics(page, 'showGrid');
      //   this.results.setData = await this.recordMetrics(page, 'setData');
      // this.results.scroll = await this.recordMetrics(page, 'scroll');
      // this.results.sort = await this.recordMetrics(page, 'sort');
      // this.results.filter = await this.recordMetrics(page, 'filter');

      console.log('Benchmark completed:');
      console.log(this.results);
    } catch (error) {
      console.error('Benchmark encountered an error:', error);
    } finally {
      await browser.close();
      console.log('Browser has been closed.');
    }

    return this.results;
  }

  private async recordMetrics(
    page: Page,
    stepName: string
  ): Promise<BenchmarkResult> {
    console.log(`Executing step: ${stepName}...`);
    const startMemory = await this.getMemoryUsage(page);
    const startTime = performance.now();

    // Trigger the corresponding method on the page
    const result = await page.evaluate(async (step: string) => {
      if (window[step as keyof typeof window]) {
        return await (window[step as keyof typeof window] as any)();
      }
      throw new Error(`Method not defined on the page: ${step}`);
    }, stepName);

    const endTime = performance.now();
    const endMemory = await this.getMemoryUsage(page);

    // FPS is only calculated for the scroll step
    const fps = stepName === 'scroll' ? await this.calculateFPS(page) : null;

    return {
      step: stepName,
      duration: endTime - startTime,
      memoryUsed: endMemory - startMemory,
      fps,
      result,
    };
  }

  private async getMemoryUsage(page: Page): Promise<number> {
    const memory = await page.evaluate(
      () => (performance as any).memory?.usedJSHeapSize || 0
    );
    console.log(`Current memory usage: ${memory} bytes`);
    return memory;
  }

  private async calculateFPS(page: Page): Promise<number> {
    return await page.evaluate(() => {
      let frames = 0;
      const start = performance.now();
      const interval = setInterval(() => frames++, 16); // Simulate frame counting
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          clearInterval(interval);
          const duration = performance.now() - start;
          resolve((frames / duration) * 1000); // FPS = frames per second
        }, 1000); // Measure for 1 second
      });
    });
  }
}
