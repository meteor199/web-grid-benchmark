import { runBenchmark } from './benchmarkRunner';
import { BenchmarkOptions } from './benchmarksCommon';

(async () => {

  const benchOptions: BenchmarkOptions = {
    url: `http://localhost:5173/`,
    iterationNumber: 1,
    disableGPU: true,
    cpuSlowdownFactor: 4,
    keepWindowOpen: true,
  };

  await runBenchmark(
    {
      name: 'test',
      urlPrefix: '',
    },
    benchOptions
  );
})();
