import now from 'performance-now';
export * from './data';

export async function wait(delay = 1000) {
  return new Promise((res) => setTimeout(res, delay));
}
