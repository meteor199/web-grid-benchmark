export * from './data';
export * from './BenchmarkHelper';

export async function wait(delay = 1000) {
  return new Promise((res) => setTimeout(res, delay));
}
