import { wait } from '.';
import { EmployeeModel, startWs, stopWs } from './data';
import { FPS } from './FPS';

export const WINDOW__BENCHMARK_HELPER = '__BENCHMARK_HELPER__';

export interface WaitForInfo {
  type?: WaitForType;
  selector?: string;
  result?: any;
}
export enum WaitForType {
  Selector = 'selector',
}

export function registerBenchmarkHelper<
  T extends { new(): BaseBenchmarkHelper },
>(target: T) {
  const instance = new (target as any)();
  (window as any)[WINDOW__BENCHMARK_HELPER] = instance;
}
export abstract class BaseBenchmarkHelper {
  public abstract init(): Promise<WaitForInfo | void>;
  public abstract renderData(): Promise<WaitForInfo | void>;
  public abstract scroll(): Promise<WaitForInfo | void>;
  public abstract sort(): Promise<WaitForInfo | void>;
  public abstract filter(): Promise<WaitForInfo | void>;
  public abstract startWebsocket(): Promise<WaitForInfo | void>;

  protected abstract insertData(data: EmployeeModel[]): Promise<WaitForInfo | void>;

  public async stopWebsocket() {
    stopWs();
  }
  public async fpsStart() {
    FPS.start();
  }
  public async fpsStop() {
    return {
      result: { fps: FPS.stop() },
    };
  }

  public async startAllDataPush(options?: {
    count: number;
    interval: number;
    total: number;
  }) {

    return await new Promise<void>((resolve) => {
      options = options || { count: 100, interval: 10, total: 10000 };
      startWs(
        {
          count: options.count,
          interval: options.interval,
          isPushAllData: true,
          total: options.total
        },
        (data) => {
          this.insertData(data);
        },
        async () => {
          await wait(1);
          resolve();
        }
      );
    });
  }
}
