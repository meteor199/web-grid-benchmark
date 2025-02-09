import { CDPSession, chromium, Page, } from 'playwright';
import { GRID_CONFIG, wait } from '@web-grid-benchmark/core';

import { RESULT_DOCS_DIR, RESULT_DIR } from './constants';
import fs from 'fs/promises';
import path from 'path';

export async function forceGC(page: Page) {
  await page.evaluate(
    "window.gc({type:'major',execution:'sync',flavor:'last-resort'})"
  );
}


export async function appendResult(fileName: string, result: Object) {
  try {
    const resultFile = path.join(RESULT_DIR, `${fileName}.jsonl`);

    await fs.access(resultFile).catch(async () => {
      await fs.writeFile(resultFile, '', 'utf8');
      console.log('Result file created:', resultFile);
    });

    const resultString = JSON.stringify(result) + '\n';
    await fs.appendFile(resultFile, resultString, 'utf8');
    console.log('Result appended to file:', resultFile);
  } catch (err) {
    console.error('Error appending result to file:', err);
  }
}

async function convertJsonlToJson(originFilePath: string, targetFilePath: string) {
  try {
    const data = await fs.readFile(originFilePath, 'utf8');
    if (!data.trim()) {
      console.error('Input file is empty.');
      return;
    }

    const jsonContent = `[${data.trim().replace(/\n/g, ',')}]`;

    await fs.writeFile(targetFilePath, jsonContent, 'utf8');
    console.log(`Converted JSONL to JSON and saved to ${targetFilePath}`);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

export async function moveResultsToDocsFile() {
  try {
    const tempDir = RESULT_DIR;
    const files = await fs.readdir(tempDir);

    for (const file of files) {
      const sourcePath = path.join(tempDir, file);
      const targetPath = path.join(RESULT_DOCS_DIR, file.replace('.jsonl', '.json'));
      await convertJsonlToJson(sourcePath, targetPath);
    }
  } catch (err) {
    console.error('Error moving results to docs file:', err);
  }
}

export async function getMemoryUsage(page: Page, client: CDPSession) {
  await forceGC(page);
  await wait(40);
  let result = (await client.send('Performance.getMetrics'))
    .metrics.find((m) => m.name === 'JSHeapUsedSize')!.value / 1024 / 1024;

  // let result = ((await page.evaluate("performance.measureUserAgentSpecificMemory()")) as any)
  //   .bytes / 1024 / 1024;

  return Number(result.toFixed(2));
}


interface TraceEvent {
  name: string;
  ph: string;  // Phase
  pid: number; // Process ID
  tid: number; // Thread ID
  ts: number;  // Timestamp
  dur?: number; // Duration
  cat: string; // Category
}

interface TraceFile {
  traceEvents: TraceEvent[];
}

export async function computeResultsCPU(tracePath: string) {
  const traceContent = await fs.readFile(tracePath, 'utf-8');
  const trace: TraceFile = JSON.parse(traceContent);

  let totalCPUTime = 0;
  let mainThreadCPUTime = 0;
  let mainThreadId: number | null = null;

  // Find main thread ID (usually the one with most events)
  const threadEventCounts = new Map<number, number>();
  trace.traceEvents.forEach(event => {
    const count = threadEventCounts.get(event.tid) || 0;
    threadEventCounts.set(event.tid, count + 1);
  });

  mainThreadId = Array.from(threadEventCounts.entries())
    .reduce((max, [tid, count]) => count > max[1] ? [tid, count] : max, [0, 0])[0];

  // Calculate CPU times
  trace.traceEvents.forEach(event => {
    // Only consider complete events with duration
    if (event.ph === 'X' && event.dur !== undefined) {
      // Convert microseconds to milliseconds
      const duration = event.dur / 1000;

      // Add to total CPU time
      totalCPUTime += duration;

      // Add to main thread time if it's on the main thread
      if (event.tid === mainThreadId) {
        mainThreadCPUTime += duration;
      }
    }
  });

  return {
    totalCPUTime: Math.round(totalCPUTime),
    mainThreadCPUTime: Math.round(mainThreadCPUTime)
  };
}

export function calcDuration(startMetrics: any, endMetrics: any) {
  const getCPUTime = (metrics: any[]) => {
    const scriptTime = metrics.find(m => m.name === 'TaskDuration').value;
    // const layoutTime = metrics.find(m => m.name === 'LayoutDuration').value;
    // const recalcStyleTime = metrics.find(m => m.name === 'RecalcStyleDuration').value;
    return scriptTime * 1000;
  };

  return {
    totalCPUTime: getCPUTime(endMetrics.metrics) - getCPUTime(startMetrics.metrics)
  }
}