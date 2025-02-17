import React from 'react';
import {
    BaseBenchmarkHelper,
    generateGridData,
    wait,
    registerBenchmarkHelper,
    testScrollElement,
    updateDataByWs,
    EmployeeModel,
} from '@web-grid-benchmark/core';
import { DataTable, initPromise, gridData, root } from './DataTable';


@registerBenchmarkHelper
export class TanStackBenchmarkHelper extends BaseBenchmarkHelper {
    async init(): Promise<void> {
        await initPromise;
    }

    async renderData(): Promise<void> {
        root.render(
            <React.StrictMode>
                <DataTable data={gridData} />
            </React.StrictMode>
        );
    }

    async scroll(): Promise<void> {
        const viewport = document.getElementById('grid-viewport');
        await testScrollElement({
            element: viewport!,
        });
    }

    async sort(): Promise<void> {
        gridData.sort((a, b) => a.name.localeCompare(b.name));
        root.render(
            <React.StrictMode>
                <DataTable data={[...gridData]} />
            </React.StrictMode>
        );
    }

    async filter(): Promise<void> {
        await wait(100);
    }

    async startWebsocket(): Promise<void> {
        await updateDataByWs(gridData, () => {
            root.render(
                <React.StrictMode>
                    <DataTable data={[...gridData]} />
                </React.StrictMode>
            );
        });
    }

    protected async insertData(data: EmployeeModel[]) {
        root.render(
            <React.StrictMode>
                <DataTable data={[...data, ...gridData]} />
            </React.StrictMode>
        );
    }
}