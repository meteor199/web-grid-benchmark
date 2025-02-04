import {
  BaseBenchmarkHelper,
  EmployeeModel,
  generateGridData,
  registerBenchmarkHelper,
  testScrollElement,
  startWs,
  wait,
  WaitForInfo,
  WaitForType,
} from '@web-grid-benchmark/core';
import { ref } from 'vue';
import { VxeGridInstance } from 'vxe-table';

const refGrid = ref<VxeGridInstance>(null as any);
const gridData = ref<EmployeeModel[]>([]);

export function useGrid() {
  return { refGrid, gridData };
}

let tempData: any[] = [];

@registerBenchmarkHelper
export class VxeBenchmarkHelper extends BaseBenchmarkHelper {
  public async init() {
    tempData = await generateGridData();
    return {
      type: WaitForType.Selector,
      selector: '.vxe-table',
    };
  }

  public async renderData(): Promise<WaitForInfo | void> {
    gridData.value = tempData;
    await wait(1);
  }

  public async scroll() {
    await testScrollElement({
      scrollFn: (scrollTop: number) => refGrid.value.scrollTo(0, scrollTop),
    });
  }

  public async sort() {
    console.log('sort');
    await refGrid.value.sort('name');
    await wait(1);
  }

  public async filter() {
    console.log('filter');
    await refGrid.value.setFilter('department', [
      {
        value: 'Engineering',
        label: 'Engineering',
        checked: true,
      },
    ]);
    await refGrid.value.updateData();

    await wait(1);
  }

  public async startWebsocket() {
    const map = new Map();
    gridData.value.forEach((item) => {
      map.set(item.id, item);
    });

    await startWs(undefined, (data) => {
      data.forEach((item) => {
        if (map.has(item.id)) {
          Object.assign(map.get(item.id), item);
        }
      });
    });
  }
}
