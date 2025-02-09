import { runBenchmark } from './benchmarkRunner';
import { BenchmarkOptions } from './benchmarksCommon';
import { GRID_DIST_DIR, RESULT_DOCS_FILE, RESULT_DOCS_FILE_THROTTLED, RESULT_FILE } from './constants';
import { startServer, stopServer } from './httpServer';
import fs from 'fs/promises';
import path from 'path';

const benchOptions: BenchmarkOptions = {
  url: ``,
  iterationNumber: 0,
  enableTraceLog: true,
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

async function convertJsonlToJson() {
  try {
    const data = await fs.readFile(RESULT_FILE, 'utf8');
    if (!data.trim()) {
      console.error('Input file is empty.');
      return;
    }

    const jsonContent = `[${data.trim().replace(/\n/g, ',')}]`;
    const jsonFilePath = benchOptions.disableGPU
      ? RESULT_DOCS_FILE_THROTTLED
      : RESULT_DOCS_FILE;
    await fs.writeFile(jsonFilePath, jsonContent, 'utf8');
    console.log(`Converted JSONL to JSON and saved to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

(async () => {
  const port = 6173;
  await startServer(port);
  await runAllBenchmarks(port);
  await stopServer();
  await convertJsonlToJson();
})();
