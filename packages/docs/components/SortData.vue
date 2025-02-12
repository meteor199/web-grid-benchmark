<template>
  <div>
    <div class="ag-theme-quartz" id="sortDataGrid" style="height: 200px; width: 100%;"></div>
    <div class="charts-container">
      <div class="chart-item">
        <div ref="timeChartRef" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { createGrid } from 'ag-grid-community'
import * as echarts from 'echarts'

const gridData = ref([])
const timeChartRef = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'results/03_sort.json?' + Date.now())
    const rawData = await response.json()

    // Transform data for grid
    gridData.value = rawData.map(item => ({
      name: item.name,
      cpuTime: Number(Number(item.totalCPUTime).toFixed(2)),
      duration: Number(Number(item.duration).toFixed(2))
    }))

    const columnDefs = [
      {
        field: 'name',
        headerName: '表格组件',
        sortable: true,
        filter: true,
        width: 150
      },
      {
        field: 'cpuTime',
        headerName: 'CPU耗时(ms)',
        width: 150,
        type: 'numericColumn'
      },
      {
        field: 'duration',
        headerName: '总耗时(ms)',
        width: 150,
        type: 'numericColumn'
      }
    ]

    const gridOptions = {
      columnDefs,
      defaultColDef: {
        sortable: true,
        resizable: true
      },
      animateRows: true
    }

    await nextTick()
    const gridDiv = document.querySelector('#sortDataGrid')
    if (gridDiv) {
      const grid = createGrid(gridDiv, gridOptions)
      grid.setGridOption('rowData', gridData.value)
    }

    // Initialize Echarts
    const timeChart = echarts.init(timeChartRef.value)
    const gridNames = gridData.value.map(item => item.name)

    // Time metrics chart
    const timeOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: gridNames,
        type: 'scroll'
      },
      grid: {
        right: '5%'
      },
      xAxis: {
        type: 'category',
        data: ['CPU耗时', '总耗时'],
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: '耗时(ms)',
      },
      series: gridNames.map(name => {
        const item = gridData.value.find(d => d.name === name)
        return {
          name: name,
          type: 'bar',
          data: [item.cpuTime, item.duration]
        }
      })
    }

    timeChart.setOption(timeOption)
  } catch (error) {
    console.error('Error loading or processing data:', error)
  }
})
</script>

<style scoped>
:deep(.ag-cell) {
  line-height: 1.5;
}

.charts-container {
  margin-top: 20px;
}

.chart-item {
  margin-bottom: 20px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}
</style>
