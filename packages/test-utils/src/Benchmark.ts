import { CDPSession, chromium, Page } from 'playwright';
import { CPUBenchmark } from './CPUBenchmark';
import { GRID_CONFIG, wait } from '@web-grid-benchmark/core';
import { BenchmarkOptions, GridData } from './benchmarksCommon';
import { RESULT_FILE, TRACE_DIR, TRACE_THROTTLED_DIR } from './constants';
import {
  getMemoryUsage,
  appendResult,
  calcDuration
} from './benchUtils';
import fs from 'fs/promises';

export class Benchmark {
  constructor(
    private task: CPUBenchmark,
    private gridData: GridData,
    private benchOptions: BenchmarkOptions
  ) {
    this.gridData = gridData; // URL of the page to benchmark
  }

  async run() {
    const args = [
      `--window-size=${GRID_CONFIG.gridWidth + 100},${GRID_CONFIG.gridHeight + 200}`,
      '--js-flags=--expose-gc',
      '--enable-benchmarking',
    ];

    if (this.benchOptions.disableGPU) {
      args.push(...[
        // '--disable-gpu',
        // '--disable-gpu-compositing',
        // '--disable-software-rasterizer',
        // '--disable-gpu-rasterization',
        // '--disable-native-gpu-memory-buffers',
        // '--disable-accelerated-2d-canvas',
        // '--disable-accelerated-video-decode',
        // -----
        '--use-gl=swiftshader',
        '--use-angle=swiftshader',
        // '--enable-webgl',
        // '--ignore-gpu-blocklist'
      ]);
    }
    const browser = await chromium.launch({
      args: args,
      headless: false
    });
    const page = await browser.newPage();

    try {
      console.log('Launching browser and navigating to the page...');

      let client = await page.context().newCDPSession(page);

      // 设置 CPU 限速
      if (this.benchOptions.cpuSlowdownFactor) {
        await client.send('Emulation.setCPUThrottlingRate', {
          rate: this.benchOptions.cpuSlowdownFactor
        });
      }

      await page.goto(this.benchOptions.url + this.gridData.urlPrefix);
      await client.send('Performance.enable');

      await this.task.init(page);

      console.log('init success');


      const memoryStart = await getMemoryUsage(page, client);
      
      // Only record trace logs if enabled in options
      if (this.benchOptions.enableTraceLog) {
        const tracePath = this.getTracePath() + '.json';
        await browser.startTracing(page, {
          path: tracePath,
          screenshots: false,
          categories: [
            'blink.user_timing',
            'devtools.timeline',
            'disabled-by-default-devtools.timeline',
            'disabled-by-default-v8.cpu_profiler',
            'disabled-by-default-v8.runtime_stats',
            'v8.execute',
            'v8',
            'rendering',
          ],
        });
      }

      const startMetrics = await client.send('Performance.getMetrics')
      const startTime = performance.now();
      const runResult = (await this.task.run(page)) || {};
      const duration = Math.floor(performance.now() - startTime);
      const endMetrics = await client.send('Performance.getMetrics');

      if (this.benchOptions.enableTraceLog) {
        await browser.stopTracing();
      }
      const memoryEnd = await getMemoryUsage(page, client);

      await this.saveMetics(startMetrics, endMetrics);

      appendResult({
        name: this.gridData.name,
        benchId: this.task.benchmarkInfo.id,
        iterationNumber: this.benchOptions.iterationNumber,
        duration,
        memoryStart,
        memoryEnd,
        ...calcDuration(startMetrics, endMetrics),
        ...runResult,
      });

      await this.task.afterRun(page, this.gridData, this.benchOptions);


    } catch (error) {
      console.error('Benchmark encountered an error:', error);
      throw error;
    } finally {
      if (this.benchOptions.keepWindowOpen) {
        console.log('Keeping browser window open. Close it manually to continue.');
        try {
          await new Promise<void>((resolve) => {
            const cleanup = () => {
              console.log('Browser window closed.');
              resolve();
            };
            browser.on('disconnected', cleanup);
          });
        } catch (error) {
          console.error('Error while waiting for browser to close:', error);
        }
      } else {
        await browser.close();
        console.log('Browser window closed.');
      }
    }
  }

  private async saveMetics(startMetrics: any, endMetrics: any) {
    const startMetricPath = this.getTracePath() + '_start.json';
    const endMetricPath = this.getTracePath() + '_end.json';

    const startMetricsJson = JSON.stringify(startMetrics, null, 2);
    const endMetricsJson = JSON.stringify(endMetrics, null, 2);
    await fs.writeFile(startMetricPath, startMetricsJson);
    await fs.writeFile(endMetricPath, endMetricsJson);
  }

  private getTracePath() {
    return `${this.benchOptions.disableGPU ? TRACE_THROTTLED_DIR : TRACE_DIR
      }/${this.gridData.name}_${this.task.benchmarkInfo.id}_${this.benchOptions.iterationNumber}`;
  }
}
