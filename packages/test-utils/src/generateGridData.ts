import { GRID_DIST_DIR } from './constants';
import { generateGridDataUseFaker } from '@web-grid-benchmark/core';
import * as fs from 'fs';
import * as path from 'path';
async function generateGridData(rows: number = 100_000): Promise<void> {
  try {
    console.log('generate data...');
    const data = Array.from({ length: rows }, (_, index) =>
      generateGridDataUseFaker(index)
    );
    await fs.promises.writeFile(
      path.resolve(GRID_DIST_DIR, 'test-data.json'),
      JSON.stringify(data, undefined, 2)
    );
    console.log('generate data success');
  } catch (error) {
    console.error('generate data error:', error);
  }
}

generateGridData();
