import{c as f,i as h}from"./index.D4Ecvuve.js";import{_ as g,p as l,v as _,P as v,o as y,c as w,j as r}from"./framework.DHS89c-t.js";const x={class:"charts-container"},D={class:"chart-item"},b={__name:"FilterData",setup(C){const t=l([]),s=l(null);return _(async()=>{try{const a=await(await fetch("/web-grid-benchmark/results/04_filter.json?"+Date.now())).json();t.value=a.map(e=>({name:e.name,cpuTime:Number(Number(e.totalCPUTime).toFixed(2)),duration:Number(Number(e.duration).toFixed(2))}));const c={columnDefs:[{field:"name",headerName:"表格组件",sortable:!0,filter:!0,width:150},{field:"cpuTime",headerName:"CPU耗时(ms)",width:150,type:"numericColumn"},{field:"duration",headerName:"总耗时(ms)",width:150,type:"numericColumn"}],defaultColDef:{sortable:!0,resizable:!0},animateRows:!0};await v();const o=document.querySelector("#filterDataGrid");o&&f(o,c).setGridOption("rowData",t.value);const m=h(s.value),n=t.value.map(e=>e.name),u={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},legend:{data:n,type:"scroll"},grid:{right:"5%"},xAxis:{type:"category",data:["CPU耗时","总耗时"],axisLabel:{interval:0}},yAxis:{type:"value",name:"耗时(ms)"},series:n.map(e=>{const d=t.value.find(p=>p.name===e);return{name:e,type:"bar",data:[d.cpuTime,d.duration]}})};m.setOption(u)}catch(i){console.error("Error loading or processing data:",i)}}),(i,a)=>(y(),w("div",null,[a[0]||(a[0]=r("div",{class:"ag-theme-quartz",id:"filterDataGrid",style:{height:"200px",width:"100%"}},null,-1)),r("div",x,[r("div",D,[r("div",{ref_key:"timeChartRef",ref:s,style:{width:"100%",height:"400px"}},null,512)])])]))}},T=g(b,[["__scopeId","data-v-7fa42ef8"]]);export{T as default};
