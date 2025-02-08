<template>
  <div>
    <div class="ag-theme-quartz" id="benchmarkGrid" style="height: 600px; width: 100%;"></div>
    <div class="charts-container">
      <template v-for="item in gridData" :key="item.id">
        <div class="chart-item">
          <div :ref="el => { if (el) chartRefs[item.id] = el }" style="width: 100%; height: 400px;"></div>
        </div>
      </template>
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
const chartRefs = ref({})

onMounted(async () => {
  try {
    const response = await fetch('./result.json')
    const rawData = await response.json()

    // Transform data to group by benchId
    const transformedData = rawData.reduce((acc, item) => {
      if (!acc[item.benchId]) {
        acc[item.benchId] = {
          id: item.benchId,
        }
      }

      const cpuTime = Number(item.totalCPUTime).toFixed(2)
      const duration = Number(item.duration).toFixed(2)
      const fps = Number(item.fps).toFixed()

      acc[item.benchId][item.name] = {
        cpuTime,
        duration,
        fps
      }
      return acc
    }, {})

    gridData.value = Object.values(transformedData)
    const gridNames = ['imgui-grid', 'ag-grid', 'vxe-table', 'visactor-vtable']

    const columnDefs = [
      {
        field: 'id',
        headerName: '推送频率',
        sortable: true,
        filter: true,
        width: 200,
        valueFormatter: (params) => {
          const id = params.value;
          if (!id) return '';

          const [, batch, interval,] = id.match(/(\d+)-(\d+)-\d+$/) || [];
          if (!interval || !batch) return id;
          return `每${interval}ms推${batch}条`;
        }
      },
      ...gridNames.map(name => ({
        field: name,
        headerName: name,
        width: 200,
        cellRenderer: params => {
          const data = params.value
          if (!data) return ''
          return `CPU: ${data.cpuTime}ms<br/>Duration: ${data.duration}ms<br/>FPS: ${data.fps}`
        }
      }))
    ]

    const gridOptions = {
      rowHeight: 72,
      columnDefs,
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true
      },
      animateRows: true
    }

    const gridDiv = document.querySelector('#benchmarkGrid')
    if (gridDiv) {
      const grid = createGrid(gridDiv, gridOptions)
      grid.setGridOption('rowData', gridData.value)
    }

    // Initialize Echarts
    await nextTick()
    gridData.value.forEach(item => {
      const [, batch, interval] = item.id.match(/(\d+)-(\d+)-\d+$/) || [];
      const chartDom = chartRefs.value[item.id];
      if (!chartDom) return;

      const myChart = echarts.init(chartDom);

      // 准备数据
      const metrics = ['CPU耗时', '总耗时', 'FPS'];
      // 分别创建耗时和FPS的系列
      const timeSeriesData = gridNames.map(name => {
        const values = item[name] || {};
        return {
          name,
          type: 'bar',
          data: [
            Number(values.cpuTime || 0),
            Number(values.duration || 0),
            '-'  // 占位，不显示
          ]
        };
      });

      const fpsSeriesData = gridNames.map(name => {
        const values = item[name] || {};
        return {
          name: name,  // 使用相同的名字
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            opacity: 0.5  // 添加透明度以区分
          },
          data: [
            '-',  // 占位，不显示
            '-',  // 占位，不显示
            Number(values.fps || 0)
          ]
        };
      });

      const option = {
        title: {
          text: `每${interval}ms推${batch}条`
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: gridNames
        },
        grid: {
          right: '20%'
        },
        xAxis: {
          type: 'category',
          data: metrics
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
        series: [...timeSeriesData, ...fpsSeriesData]
      };

      myChart.setOption(option);
    });
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
