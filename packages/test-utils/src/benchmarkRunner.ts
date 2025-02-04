import { Benchmark } from './Benchmark';
import { BenchmarkOptions, GridData } from './benchmarksCommon';
import { BenchRenderData } from './benchs/BenchRenderData';
import { BenchScroll } from './benchs/BenchScroll';
import { BenchSort } from './benchs/BenchSort';
import { BenchFilter } from './benchs/BenchFilter';
import { BenchPush } from './benchs/BenchPush';

export async function runBenchmark(
  gridData: GridData,
  benchOptions: BenchmarkOptions
) {
  // Launch the browser

  const tasks = [
    new BenchRenderData(),
    new BenchScroll(),
    new BenchSort(),
    new BenchFilter(),
    new BenchPush(),
  ];
  for (const task of tasks) {
    const benchmark = new Benchmark(task, gridData, benchOptions);
    console.log(
      `Starting ${gridData.name} benchmark ${benchOptions.iterationNumber}:`,
      task.benchmarkInfo.label
    );
    await benchmark.run();
  }
}
