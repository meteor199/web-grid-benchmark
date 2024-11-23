import { runBenchmark } from './benchmarkRunner';
import { startServer, stopServer } from './httpServer';

(async () => {
  const port = 5173;
  await startServer(port);
  await runBenchmark(`http://localhost:${port}/ag-grid/`);
  await stopServer();
})();
