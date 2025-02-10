import { Benchmark } from './Benchmark';
import { BenchmarkOptions, GridData } from './benchmarksCommon';
import { BenchRenderData } from './benchs/BenchRenderData';
import { BenchScroll } from './benchs/BenchScroll';
import { BenchSort } from './benchs/BenchSort';
import { BenchFilter } from './benchs/BenchFilter';
import { BenchPush } from './benchs/BenchPush';
import { BenchBulkDataPush } from './benchs/BenchBulkDataPush';

export async function runBenchmark(
  gridData: GridData,
  benchOptions: BenchmarkOptions
) {
  // Launch the browser

  const tasks = [
    // new BenchRenderData(),
    new BenchScroll(),
    // new BenchSort(),
    // new BenchFilter(),
    // new BenchPush(),

    // 总1万条数据，每100ms推送5条数据
    // new BenchBulkDataPush({ count: 1, interval: 1, total: 10000 }),
    // new BenchBulkDataPush({ count: 1, interval: 10, total: 10000 }),
    // new BenchBulkDataPush({ count: 10, interval: 10, total: 10000 }),
    // new BenchBulkDataPush({ count: 100, interval: 10, total: 10000 }),
    // new BenchBulkDataPush({ count: 100, interval: 100, total: 10000 }),
  ];
  for (const task of tasks) {
    const benchmark = new Benchmark(task, gridData, benchOptions);
    console.log(
      `Starting ${gridData.name} benchmark ${benchOptions.iterationNumber}:`,
      task.benchmarkInfo.label
    );
    const startTime = performance.now();
    await benchmark.run();
    const duration = Math.floor(performance.now() - startTime);
    console.log(`Benchmark completed in ${duration}ms`);
  }
}
