import { runBenchmark } from './benchmarkRunner';
import { BenchmarkOptions } from './benchmarksCommon';
import { moveResultsToDocsFile } from './benchUtils';
import { GRID_DIST_DIR, RESULT_DIR } from './constants';
import { startServer, stopServer } from './httpServer';
import fs from 'fs/promises';
import path from 'path';

const benchOptions: BenchmarkOptions = {
  url: ``,
  iterationNumber: 0,
  // enableTraceLog: true,
  // disableGPU: true,
  // cpuSlowdownFactor: 4,
  // keepWindowOpen: true,
};

async function runAllBenchmarks(port: number) {
  const subdirectories = await getSubdirectories(GRID_DIST_DIR);

  const iterationCount = 1;
  benchOptions.url = `http://localhost:${port}/`;

  for (let i = 0; i < iterationCount; i++) {
    for (const name of subdirectories) {
      await runBenchmark(
        {
          name: name,
          urlPrefix: `${name}`,
        },
        {
          ...benchOptions,
          iterationNumber: i + 1,
        }
      );
    }
  }
}

async function getSubdirectories(directory: string) {
  try {
    const files = await fs.readdir(directory);
    const subdirectories = [];

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        subdirectories.push(file);
      }
    }

    return subdirectories;
  } catch (err) {
    console.error('Error reading directory:', err);
    throw err;
  }
}

async function initResultDir() {
  try {
    await fs.mkdir(RESULT_DIR, { recursive: true });
    console.log('Result directory initialized:', RESULT_DIR);
  } catch (err) {
    console.error('Error initializing result directory:', err);
    throw err;
  }
}

(async () => {
  try {
    await initResultDir();
    const port = 6173;
    await startServer(port);
    await runAllBenchmarks(port);
    await stopServer();
    await moveResultsToDocsFile();
  } catch (err) {
    console.error('Error in main:', err);
    process.exit(1);
  }
})();
