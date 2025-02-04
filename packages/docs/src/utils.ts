import { BenchmarkResult, BenchmarkSummary, MetricData, ProcessedData, StatsSummary } from "./types";

export function quantile(arr: number[], q: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function calculateStats(values: number[]): MetricData {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
  );

  return {
    values,
    mean,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    median: quantile(values, 0.5)
  };
}

export function processData(data: BenchmarkResult[]): ProcessedData {
  const combinations = [...new Set(data.map(d => `${d.name}|${d.benchId}`))];

  const metrics: ProcessedData['metrics'] = {
    duration: { label: 'Duration (ms)', data: {} },
    memoryIncrement: { label: 'Memory Increment (MB)', data: {} },
    totalCPUTime: { label: 'Total CPU Time (ms)', data: {} },
  };

  // Only add fps metric if any result has fps data
  if (data.some(d => d.fps !== undefined)) {
    metrics.fps = { label: 'FPS', data: {} };
  }

  const summaryData = combinations.map(combo => {
    const comboData = data.filter(d => `${d.name}|${d.benchId}` === combo);
    const [name, benchId] = combo.split('|');

    const summary: BenchmarkSummary = {
      name,
      benchId,
      runCount: comboData.length,
      duration: {} as StatsSummary,
      memoryIncrement: {} as StatsSummary,
      memoryStart: {} as StatsSummary,
      memoryEnd: {} as StatsSummary,
      totalCPUTime: {} as StatsSummary,
      fps: {} as StatsSummary,
    };

    // Process regular metrics
    ['duration', 'totalCPUTime', ].forEach(metric => {
      const values = comboData.map(d => d[metric as keyof BenchmarkResult] as number);
      const stats = calculateStats(values);
      metrics[metric as keyof typeof metrics]!.data[combo] = stats;

      (summary as any)[metric as keyof typeof summary] = {
        mean: stats.mean.toFixed(2),
        stdDev: stats.stdDev.toFixed(2),
        min: stats.min.toFixed(2),
        max: stats.max.toFixed(2),
        median: stats.median.toFixed(2)
      } as StatsSummary;
    });

    // Process memory metrics
    const memoryStartValues = comboData.map(d => d.memoryStart);
    const memoryStartStats = calculateStats(memoryStartValues);
    summary.memoryStart = {
      mean: memoryStartStats.mean.toFixed(2),
      stdDev: memoryStartStats.stdDev.toFixed(2),
      min: memoryStartStats.min.toFixed(2),
      max: memoryStartStats.max.toFixed(2),
      median: memoryStartStats.median.toFixed(2)
    };

    const memoryEndValues = comboData.map(d => d.memoryEnd);
    const memoryEndStats = calculateStats(memoryEndValues);
    summary.memoryEnd = {
      mean: memoryEndStats.mean.toFixed(2),
      stdDev: memoryEndStats.stdDev.toFixed(2),
      min: memoryEndStats.min.toFixed(2),
      max: memoryEndStats.max.toFixed(2),
      median: memoryEndStats.median.toFixed(2)
    };

    // Process memory usage
    const memoryValues = comboData.map(d => d.memoryEnd - d.memoryStart);
    const memoryStats = calculateStats(memoryValues);
    metrics.memoryIncrement.data[combo] = memoryStats;
    summary.memoryIncrement = {
      mean: memoryStats.mean.toFixed(2),
      stdDev: memoryStats.stdDev.toFixed(2),
      min: memoryStats.min.toFixed(2),
      max: memoryStats.max.toFixed(2),
      median: memoryStats.median.toFixed(2)
    } as StatsSummary;

    // Process fps only if it exists in the data
    const fpsValues = comboData.map(d => d.fps).filter((fps): fps is number => fps !== undefined);
    if (fpsValues.length > 0 && metrics.fps) {
      const fpsStats = calculateStats(fpsValues);
      metrics.fps.data[combo] = fpsStats;
      summary.fps = {
        mean: fpsStats.mean.toFixed(2),
        stdDev: fpsStats.stdDev.toFixed(2),
        min: fpsStats.min.toFixed(2),
        max: fpsStats.max.toFixed(2),
        median: fpsStats.median.toFixed(2)
      } as StatsSummary;
    }

    return summary;
  });

  return { combinations, metrics, summaryData };
}

export async function loadData(filePath: string): Promise<ProcessedData> {
  try {
    const response = await fetch(filePath);
    const data: BenchmarkResult[] = await response.json();
    return processData(data);
  } catch (error) {
    throw new Error(`Failed to load data: ${(error as Error).message}`);
  }
}
