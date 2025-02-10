<template>
  <div>
    <div class="ag-theme-quartz" id="renderDataGrid" style="height: 200px; width: 100%;"></div>
    <div class="charts-container">
      <div class="chart-item">
        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
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
const chartRef = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'results/02_scroll.json?' + Date.now())
    const rawData = await response.json()

    // Transform data for grid
    gridData.value = rawData.map(item => ({
      name: item.name,
      cpuTime: Number(item.totalCPUTime).toFixed(2),
      duration: Number(item.duration).toFixed(2),
      fps: Number(item.fps).toFixed()
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
      },
      {
        field: 'fps',
        headerName: '帧率(FPS)',
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

    const gridDiv = document.querySelector('#renderDataGrid')
    if (gridDiv) {
      const grid = createGrid(gridDiv, gridOptions)
      grid.setGridOption('rowData', gridData.value)
    }

    // Initialize Echarts
    await nextTick()
    if (chartRef.value) {
      const myChart = echarts.init(chartRef.value)
      const gridNames = gridData.value.map(item => item.name)
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['CPU耗时', '总耗时', '帧率']
        },
        grid: {
          right: '20%'
        },
        xAxis: {
          type: 'category',
          data: gridNames,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '耗时(ms)',
            position: 'left'
          },
          {
            type: 'value',
            name: 'FPS',
            position: 'right',
            min: 0,
            max: 60,
            interval: 10,
            axisLine: {
              show: true
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'CPU耗时',
            type: 'bar',
            data: gridData.value.map(item => Number(item.cpuTime))
          },
          {
            name: '总耗时',
            type: 'bar',
            data: gridData.value.map(item => Number(item.duration))
          },
          {
            name: '帧率',
            type: 'bar',
            yAxisIndex: 1,
            itemStyle: {
              opacity: 0.5
            },
            data: gridData.value.map(item => Number(item.fps))
          }
        ]
      }

      myChart.setOption(option)
    }
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
