import path from 'path';

export const WORKSPACE_DIR = path.resolve(__dirname, '../../../');
export const GRID_DIST_DIR = path.resolve(WORKSPACE_DIR, 'dist');

export const DIST_DIR = path.resolve(
  WORKSPACE_DIR,
  'packages',
  'test-utils',
  'dist'
);
export const TRACE_DIR = path.resolve(DIST_DIR, 'traces');
export const TRACE_THROTTLED_DIR = path.resolve(DIST_DIR, 'traces-throttled');

export const SCREENSHOT_DIR = path.resolve(DIST_DIR, 'screenshots');

function generateFileNameByDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  return timestamp;
}


export const RESULT_DIR = path.resolve(
  DIST_DIR,
  `results-${generateFileNameByDate()}`
);

export const RESULT_DOCS_DIR = path.resolve(
  WORKSPACE_DIR,
  'packages',
  'docs',
  'public',
  'results'
);
