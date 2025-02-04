import {
  EmployeeModel, getColumns, GRID_CONFIG, isDev,
  wait
} from '@web-grid-benchmark/core';

interface ModuleConfig {
  preRun: any[];
  postRun: any[];
  print: (message: string) => void;
  printErr: (error: string) => void;
  canvas: HTMLCanvasElement;
  setStatus: (status: string) => void;
  monitorRunDependencies: (dependencies: number) => void;
}


type FilterOperation = 'contains' | 'equals' | 'startsWith' | 'endsWith';
const encoder = new TextEncoder();

export class TableApi {
  private Module: any = {};
  private canvas: HTMLCanvasElement | null = null;
  private dataLayout: Record<keyof EmployeeModel, [number, number]> = {} as any;
  private structSize: number = 0;
  private charCache = new Map<string, number[]>();
  private prtCache = new Map<string, number>();


  async render(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;

    try {
      const wasmModule = Function(
        `"use strict";return import("${isDev() ? '' : '/imgui-grid'}/imgui_grid.js")`
      )();

      const moduleConfig: ModuleConfig = {
        preRun: [],
        postRun: [],
        print: (message: string) => console.log(message),
        printErr: (error: string) => console.error(error),
        canvas,
        setStatus: (status: string) => console.log('status: ' + status),
        monitorRunDependencies: () => { },
      };

      this.Module = await (await wasmModule).default(moduleConfig);

      (window as any).Module1 = this.Module;

      this.structSize = this.getStructSize();

      this.dataLayout = this.getDataLayout();
      console.log('structSize,dataLayout:', this.structSize, this.dataLayout);


    } catch (error) {
      console.error('Failed to initialize WASM module:', error);
      throw error;
    }
  }

  private allocateString(str: string): { ptr: number, length: number } {
    const lengthBytes = this.Module.lengthBytesUTF8(str) + 1;
    const bufferPtr = this.Module._malloc(lengthBytes);
    this.Module.stringToUTF8(str, bufferPtr, lengthBytes);
    return { ptr: bufferPtr, length: lengthBytes };
  }

  private freeMemory(ptr: number): void {
    this.Module._free(ptr);
  }

  async init() {
    try {
      const config = {
        columns: getColumns(),
        width: GRID_CONFIG.gridWidth,
        height: GRID_CONFIG.gridHeight,
      };

      const { ptr } = this.allocateString(JSON.stringify(config));
      const init = this.Module.cwrap('init_table', null, ['number']);
      try {
        init(ptr);
      } catch (error) {
        console.error('Failed to initialize table:', error);
        // throw error;
      }
      this.freeMemory(ptr);

      console.log('wasm memory size (init success)', this.Module.HEAPU8.buffer.byteLength / 1024 / 1024);

      const msg_loop_ems = this.Module.cwrap('msg_loop_ems', null, []);

      await wait(1);
      function msg_loop() {
        msg_loop_ems();
        requestAnimationFrame(msg_loop);
      }
      msg_loop();
    } catch (error) {
      console.error('Failed to initialize table:', error);
      // throw error;
    }
  }

  private getStructSize(): number {
    const get_employee_data_size = this.Module.cwrap('get_employee_data_size', null);

    const structSize = get_employee_data_size();

    return structSize;
  }

  private getDataLayout() {
    const get_employee_data_layout = this.Module.cwrap('get_employee_data_layout', 'string', []);
    const layoutJson = get_employee_data_layout();
    this.Module._free(layoutJson);

    const layout = JSON.parse(layoutJson);
    return layout as Record<keyof EmployeeModel, [number, number]>;
  }

  private validateEmployeeData(ptrArray: Int32Array, sourceData: EmployeeModel[]) {

    const get_test_employee_data = this.Module.cwrap('get_test_employee_data', 'string', []);
    const sampleData = get_test_employee_data();
    const samples = JSON.parse(sampleData);
    console.log('Sample records:', samples);

    const dataIndexArr = [0, 4, 9, 80000];

    const errors: string[] = [];
    for (let i = 0; i < dataIndexArr.length; i++) {
      const sourceDataIndex = dataIndexArr[i];
      const sample = samples[i];
      const jsData = sourceData[sourceDataIndex];
      // console.log('Data at index', sourceDataIndex, jsData);
      // 验证每个字段
      Object.keys(jsData).forEach(key => {
        const jsValue = jsData[key as keyof EmployeeModel];
        const cppValue = sample[key];

        if (jsValue !== cppValue) {
          errors.push(`Field '${key}' mismatch at index ${sourceDataIndex}: JS="${jsValue}", C++="${cppValue}"`);
        }
      });
    }
    if (errors.length > 0) {
      console.error(`Data validation errors:`, errors);
      throw new Error(`Data validation  errors:\n${errors.join('\n')}`);
    }
    console.log('Data validation passed.');
  }

  async set_temp_data(data: EmployeeModel[]): Promise<void> {
    try {

      console.log('create_employee_data_array', data.length);
      console.time('create_employee_data_array');
      const setTempData = this.Module.cwrap('create_employee_data_array', 'number', ['number']);
      const arrayPtr = setTempData(data.length);
      console.timeEnd('create_employee_data_array');


      // 获取指针数组
      const ptrArray = new Int32Array(this.Module.HEAP32.buffer, arrayPtr, data.length);

      console.time('fill_data');

      // 遍历每个结构体
      for (let i = 0; i < data.length; i++) {
        const structPtr = ptrArray[i];
        this.prtCache.set(data[i].id, structPtr);
        this.setDataItem(structPtr, data[i]);
      }
      console.timeEnd('fill_data');

      // 打印示例数据
      this.validateEmployeeData(ptrArray, data);

      console.log('wasm memory size (set temp data success)', this.Module.HEAPU8.buffer.byteLength / 1024 / 1024);

    } catch (error) {
      console.error('Failed to set temporary data:', error);
      throw error;
    }
  }

  private setDataItem(structPtr: number, dataItem: EmployeeModel) {
    const layout = this.dataLayout;
    const view = new DataView(this.Module.HEAPU8.buffer, structPtr, this.structSize);

    // 使用字符缓存的写入函数
    const writeString = (str: string, offset: number, maxLength: number) => {
      let currentOffset = offset;
      const len = Math.min(str.length, maxLength - 1);
      for (let j = 0; j < len; j++) {
        const char = str[j];
        let bytes = this.charCache.get(char);
        if (!bytes) {
          bytes = Array.from(encoder.encode(char));
          this.charCache.set(char, bytes);
        }
        for (let k = 0; k < bytes.length && (currentOffset + k) < (currentOffset + maxLength - 1); k++) {
          view.setUint8(currentOffset + k, bytes[k]);
        }
        currentOffset += bytes.length;
      }
      view.setUint8(currentOffset, 0); // null 终止符
    };

    // 写入所有字段
    writeString(dataItem.id, layout['id'][0], layout['id'][1]);
    writeString(dataItem.name, layout['name'][0], layout['name'][1]);
    writeString(dataItem.email, layout['email'][0], layout['email'][1]);
    view.setInt32(layout['age'][0], dataItem.age, true);
    view.setFloat64(layout['salary'][0], dataItem.salary, true);
    writeString(dataItem.department, layout['department'][0], layout['department'][1]);
    writeString(dataItem.position, layout['position'][0], layout['position'][1]);
    writeString(dataItem.startDate, layout['startDate'][0], layout['startDate'][1]);
    view.setUint8(layout['isActive'][0], dataItem.isActive ? 1 : 0);
    view.setFloat64(layout['performance'][0], dataItem.performance, true);
    writeString(dataItem.phone, layout['phone'][0], layout['phone'][1]);
    writeString(dataItem.address, layout['address'][0], layout['address'][1]);
    writeString(dataItem.city, layout['city'][0], layout['city'][1]);
    writeString(dataItem.country, layout['country'][0], layout['country'][1]);
    view.setInt32(layout['projects'][0], dataItem.projects, true);
    view.setFloat64(layout['rating'][0], dataItem.rating, true);
    writeString(dataItem.lastEvaluation, layout['lastEvaluation'][0], layout['lastEvaluation'][1]);
    view.setFloat64(layout['bonus'][0], dataItem.bonus, true);
    view.setFloat64(layout['efficiency'][0], dataItem.efficiency, true);
    writeString(dataItem.team, layout['team'][0], layout['team'][1]);
    writeString(dataItem.skills, layout['skills'][0], layout['skills'][1]);
    view.setInt32(layout['certifications'][0], dataItem.certifications, true);
    view.setFloat64(layout['overtime'][0], dataItem.overtime, true);
    view.setInt32(layout['vacationDays'][0], dataItem.vacationDays, true);
    view.setInt32(layout['trainings'][0], dataItem.trainings, true);
    writeString(dataItem.reportsTo, layout['reportsTo'][0], layout['reportsTo'][1]);
    writeString(dataItem.office, layout['office'][0], layout['office'][1]);
    view.setFloat64(layout['expenses'][0], dataItem.expenses, true);
    view.setFloat64(layout['satisfaction'][0], dataItem.satisfaction, true);
    writeString(dataItem.notes, layout['notes'][0], layout['notes'][1]);
  }

  setScrollTop(scrollTop: number): void {
    try {
      const setScrollTop = this.Module.cwrap('set_scroll_top', null, ['number']);
      setScrollTop(scrollTop);
    } catch (error) {
      console.error('Failed to set scroll top:', error);
      throw error;
    }
  }

  setData(): void {
    try {
      const setData = this.Module.cwrap('set_data', null, []);
      setData();
    } catch (error) {
      console.error('Failed to set data:', error);
      throw error;
    }
  }

  insertData(data: EmployeeModel[]): void {
    try {
      console.time('insert_data');
      const insertData = this.Module.cwrap('create_employee_data_array', 'number', ['number']);
      const arrayPtr = insertData(data.length);
      
      // Get pointer array for new data
      const ptrArray = new Int32Array(this.Module.HEAP32.buffer, arrayPtr, data.length);
      
      // Fill new data
      for (let i = 0; i < data.length; i++) {
        const structPtr = ptrArray[i];
        this.prtCache.set(data[i].id, structPtr);
        this.setDataItem(structPtr, data[i]);
      }
      console.timeEnd('insert_data');
      
      // Apply changes
      this.setData();
    } catch (error) {
      console.error('Failed to insert data:', error);
      throw error;
    }
  }

  updateData(data: EmployeeModel[]): void {
    for (const item of data) {
      this.setDataItem(this.prtCache.get(item.id)!, item);
    }
  }

  destroy(): void {
    if (this.Module._cancel_main_loop) {
      this.Module._cancel_main_loop();
    }
  }

  sortData(column: string, ascending: boolean): void {
    try {
      const sortData = this.Module.cwrap('sort_data', null, ['string', 'boolean']);
      sortData(column, ascending);
    } catch (error) {
      console.error('Failed to sort data:', error);
      throw error;
    }
  }

  filterData(column: string, op: FilterOperation, value: string): void {
    try {
      const filterData = this.Module.cwrap('filter_data', null, ['string', 'string', 'string']);
      filterData(column, op, value);
    } catch (error) {
      console.error('Failed to filter data:', error);
      throw error;
    }
  }
}