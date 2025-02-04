import { GRID_CONFIG } from './data';

export * from './data';
export * from './BaseBenchmarkHelper';
export * from './testUtils';

export async function wait(delay = 1000) {
  return new Promise((res) => setTimeout(res, delay));
}

// Register the Component only if in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  import('./TestcaseComponent');
}
