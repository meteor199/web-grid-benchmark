import { chromium, Page } from 'playwright';
import { BenchRenderData } from './benchmarks';
import { wait } from '@web-grid-benchmark/core';

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

      let client = await page.context().newCDPSession(page);
      await page.goto(this.url);
      console.log('initBenchmark Playwright');
      let categories = [
        'blink.user_timing',
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
      ];

      const benchRenderData = new BenchRenderData();
      await benchRenderData.init(page);

      // await forceGC(page);

      // const tracePath = fileNameTrace(framework, benchmark.benchmarkInfo, i, benchmarkOptions)

      // await browser.startTracing(page, {
      //   path: tracePath,
      //   screenshots: false,
      //   categories: categories,
      // });
      await wait(1000);
      const start = performance.now();
      await benchRenderData.run(page);
      const duration = performance.now() - start;
      console.log(`Render data took ${duration} ms`);

      await wait(2000);
      // await browser.stopTracing();
      // let result = await computeResultsCPU(tracePath);
      // let resultScript = await computeResultsJS(
      //   result,
      //   config,
      //   tracePath
      // );
      // let resultPaint = await computeResultsPaint(
      //   result,
      //   config,
      //   tracePath
      // );

      // let res = { total: result.duration, script: resultScript, paint: resultPaint };
      // results.push(res);
      // console.log(`duration for ${framework.name} and ${benchmark.benchmarkInfo.id}: ${JSON.stringify(res)}`);
      // if (result.duration < 0) throw new Error(`duration ${result} < 0`);
      // try {
      //   if (page) {
      //     await page.close();
      //   }
      // } catch (error) {
      //   console.log("ERROR closing page", error);
      // }
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

async function forceGC(page: Page) {
  await page.evaluate(
    "window.gc({type:'major',execution:'sync',flavor:'last-resort'})"
  );
}
