<template>
  <div class="ag-theme-quartz" id="benchmarkGrid" style="height: 600px; width: 100%;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { createGrid } from 'ag-grid-community'

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

    const gridData = Object.values(transformedData)

    // Get unique grid names
    const gridNames = [...new Set(rawData.map(item => item.name))]

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
          
          const [,batch, interval, ] = id.match(/(\d+)-(\d+)-\d+$/) || [];
          if (!interval || !batch) return id;
          return `每${interval}ms推送${batch}条数据`;
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
      grid.setGridOption('rowData', gridData)
    }
  } catch (error) {
    console.error('Error loading or processing data:', error)
  }
})
</script>

<style>
.ag-cell {
  line-height: 1.5;
}
</style>
