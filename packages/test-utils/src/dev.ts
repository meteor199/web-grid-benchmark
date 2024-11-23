import { runBenchmark } from './benchmarkRunner';

(async () => {
  await runBenchmark(`http://localhost:5173/`);
})();
