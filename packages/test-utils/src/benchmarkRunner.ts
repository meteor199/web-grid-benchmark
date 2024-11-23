import { chromium, Page } from 'playwright';
import { Benchmark } from './Benchmark';

export async function runBenchmark(url: string) {
  // Launch the browser

  const benchmark = new Benchmark(url);
  const results = await benchmark.run();

  // Output final benchmark results
  console.log('Final benchmark results:', results);
}

async function forceGC(page: Page) {
  await page.evaluate(
    "window.gc({type:'major',execution:'sync',flavor:'last-resort'})"
  );
}
