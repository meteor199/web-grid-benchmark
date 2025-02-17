
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    createColumnHelper,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import {
    generateGridData,
    getColumns,
    wait,
    BaseBenchmarkHelper,
    WaitForInfo,
    WaitForType,
    registerBenchmarkHelper,
    testScrollElement,
    startWs,
    EmployeeModel,
    GRID_CONFIG,
    GRID_CONFIG_STYLE_COL,
    getDepartmentColor,
    GRID_CONFIG_PERCENTAGE_COL,
    GRID_CONFIG_ICON_COL,
    updateDataByWs,
} from '@web-grid-benchmark/core';


const columns: ColumnDef<EmployeeModel, unknown>[] = getColumns().map((item) => ({
    id: item.field,
    accessorKey: item.field,
    header: item.header,
    size: item.width,
    enableSorting: item.sortable || false,
    enableColumnFilter: item.filterable || false,
    cell: (info) => {
        const value = info.getValue() as any;
        if (item.field === GRID_CONFIG_STYLE_COL) {
            return (
                <div style={{ backgroundColor: getDepartmentColor(value) }}>
                    {value}
                </div>
            );
        }
        if (item.field === GRID_CONFIG_PERCENTAGE_COL) {
            const performance = value as number;
            const percentage = (performance * 100).toFixed(0) + '%';
            return (
                <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
                    <div
                        style={{
                            width: percentage,
                            backgroundColor:
                                performance < 0.3
                                    ? '#ff6b6b'
                                    : performance < 0.7
                                        ? '#4ecdc4'
                                        : '#45b7af',
                            height: '20px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            color: 'white',
                        }}
                    >
                        {percentage}
                    </div>
                </div>
            );
        }
        if (item.field === GRID_CONFIG_ICON_COL) {
            const status = (value as string).toLowerCase();
            const iconMap: { [key: string]: string } = {
                active: '🟢',
                inactive: '🔴',
                pending: '🟡',
            };
            return <span>{iconMap[status] || status}</span>;
        }
        return value?.toString() || '';
    },
}));

interface TableProps {
    data: EmployeeModel[];
    onStateChange?: () => void;
}

export function DataTable({ data, onStateChange }: TableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const { rows } = table.getRowModel();
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 35, // 预估的行高
        overscan: 10, // 预加载的行数
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom = virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

    useEffect(() => {
        onStateChange?.();
    }, [sorting, onStateChange]);

    return (
        <div
            ref={tableContainerRef}
            style={{ height: '600px', overflow: 'auto' }}
            id="grid-viewport"
        >
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                    {columns.map((col) => (
                        <col key={col.id} style={{ width: col.size }} />
                    ))}
                </colgroup>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f4f4f4',
                                        borderBottom: '2px solid #ddd',
                                        position: 'sticky',
                                        top: 0,
                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        zIndex: 1,
                                        width: header.getSize(),
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: ' 🔼',
                                        desc: ' 🔽',
                                    }[header.column.getIsSorted() as string] ?? null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
                        </tr>
                    )}
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            padding: '8px',
                                            borderBottom: '1px solid #ddd',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export let gridData: EmployeeModel[] = [];
export let root: ReturnType<typeof createRoot>;

export const initPromise = new Promise<void>((resolve) => {
    window.addEventListener('load', async () => {
        gridData = await generateGridData();

        const container = document.getElementById('grid-container');
        if (container) {
            root = createRoot(container);
            root.render(
                <React.StrictMode>
                    <DataTable data={[]} />
                </React.StrictMode>
            );
        }
        await wait(1);
        resolve();
    });
});