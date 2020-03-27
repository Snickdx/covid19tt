function convertToLineData(e){let t=[],a=[],o=[],n=[],i=[],s=[],l={},c=0;for(let r of e)r.date in l?(a[c-1]=r.tested,o[c-1]=r.cases.imported,n[c-1]=r.cases.deaths,i[c-1]=r.cases.community,s[c-1]=r.cases.contact):(t.push(`Day ${c}`),a.push(r.tested),o.push(r.cases.imported),n.push(r.cases.deaths),i.push(r.cases.community),s.push(r.cases.contact),l[r.date]=!0,c++);return{categories:t,imported:o,deaths:n,tested:a,community:i,contact:s}}function displayLineChart(e){let{categories:t,tested:a,imported:o,community:n,contact:i}=convertToLineData(e),s={fontFamily:"monospace",color:"white",fontSize:"15px"},l={style:{fontSize:"15px"}};Highcharts.chart("linechart",{chart:{type:"line",backgroundColor:"transparent",height:"500px",scrollablePlotArea:{minWidth:600,scrollPositionX:0}},title:{text:void 0,style:s,useHtml:!0},tooltip:{pointFormat:"<b>{point.y} cases were {point.series.name}</b>"},xAxis:{categories:t,labels:{style:s}},yAxis:{title:{text:void 0,useHtml:!0,style:{color:"white",fontSize:"12px"}},labels:{enabled:!1}},plotOptions:{line:{dataLabels:{enabled:!0,style:{fontFamily:"monospace",color:"white"}},enableMouseTracking:!0}},legend:{itemStyle:{color:"white"}},series:[{name:"Imported",data:o,dataLabels:l,label:{enabled:!1}},{name:"Tested",data:a,dataLabels:l,label:{enabled:!1}},{name:"Community",data:n,dataLabels:l,label:{enabled:!1}},{name:"Contact",data:i,dataLabels:l,label:{enabled:!1}}],responsive:{rules:[{condition:{maxWidth:"800px"},chartOptions:{legend:{layout:"horizontal",align:"center",verticalAlign:"bottom"}}}]}})}function displayPieChart({cases:e}){let t=[{name:"Imported",y:e.imported},{name:"Community",y:e.community},{name:"Contact",y:e.contact}];Highcharts.chart("piechart",{chart:{plotBackgroundColor:"transparent",backgroundColor:"transparent",plotBorderWidth:null,plotShadow:!1,type:"pie",zoomType:"xy"},title:{text:void 0,style:{fontFamily:"monospace",color:"white",fontSize:"15px"},useHtml:!0},tooltip:{pointFormat:"<b>{point.y} persons tested positive are {point.name}</b>"},accessibility:{point:{valueSuffix:"%"}},legend:{itemStyle:{color:"white"}},plotOptions:{pie:{allowPointSelect:!0,cursor:"pointer",dataLabels:{enabled:!1},showInLegend:!0}},series:[{name:"Cases",colorByPoint:!0,data:t}]})}