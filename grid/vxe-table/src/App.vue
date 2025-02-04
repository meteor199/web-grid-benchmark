<template>
  <div>
    <vxe-grid
      class="grid-container"
      :columns="columns"
      :data="gridData"
      v-bind="gridOptions"
      ref="refGrid"
    >
      <template #performance="{ row }">
        <div style="width: 100%; background-color: #e0e0e0; border-radius: 4px">
          <div
            :style="{
              width: `${row.performance * 100}%`,
              backgroundColor:
                row.performance < 0.3
                  ? '#ff6b6b'
                  : row.performance < 0.7
                    ? '#4ecdc4'
                    : '#45b7d1',
              height: '20px',
              borderRadius: '4px',
              textAlign: 'left',
              color: 'white',
              lineHeight: '20px',
            }"
          >
            {{ (row.performance * 100).toFixed(0) + '%' }}
          </div>
        </div>
      </template>

      <template #name="{ row }">
        <div>
          <span
            style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #007bff;
              color: white;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
            "
          >
            {{ row.name.charAt(0).toUpperCase() }}
          </span>
          <span>{{ row.name }}</span>
        </div>
      </template>

      <template #department="{ row }">
        <div
          :style="{
            backgroundColor: getDepartmentColor(row.department),
            borderRadius: '4px',
          }"
        >
          {{ row.department }}
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import {
  DATA_ENUM_DEPARTMENTS,
  getColumns,
  GRID_CONFIG,
  GRID_CONFIG_ICON_COL,
  GRID_CONFIG_PERCENTAGE_COL,
  GRID_CONFIG_STYLE_COL,
  getDepartmentColor,
} from '@web-grid-benchmark/core';
import { h, reactive, ref } from 'vue';
import 'vxe-table/lib/style.css';
import { useGrid } from './VxeBenchmarkHelper';
import { VxeColumnProps, VxeGridProps, VxeGridPropTypes } from 'vxe-table';

const { gridData, refGrid } = useGrid();
const columns = ref<VxeColumnProps[]>(
  getColumns().map((item) => {
    const result: VxeColumnProps = {
      field: item.field,
      title: item.header,
      width: item.width,
      sortable: item.sortable,
      filters: item.filterable ? [] : undefined,
      fixed: item.pinned ? 'left' : undefined,
    };
    if (item.field === 'department') {
      result.filters = DATA_ENUM_DEPARTMENTS.map((item) => ({
        label: item,
        value: item,
      })) as any;
      (result as any).slots = { default: 'department' };
    }

    // 
    if (item.field === GRID_CONFIG_PERCENTAGE_COL) {
      (result as any).slots = { default: 'performance' };
    }

    // 
    if (item.field === GRID_CONFIG_ICON_COL) {
      (result as any).slots = { default: 'name' };
    }

    return result;
  })
);

const gridOptions = reactive<VxeGridProps<any>>({
  border: true,
  showOverflow: true,
  height: GRID_CONFIG.gridHeight,
  rowConfig: {
    height: GRID_CONFIG.rowHeight,
  },
  scrollY: {
    enabled: true,
    gt: 0,
  },
  scrollX: {
    enabled: true,
    gt: 0,
  },
});
</script>

<style scoped>
/* Optional custom styles for your table */
</style>
