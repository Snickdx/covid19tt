function convertToLineData(data){
    let categories = [];
    let tested = [];
    let positive = [];
    let deaths = [];
    let discharged = [];

    let uniqeDates = {};

    let i =0;
    for (let ele of data){
        if(ele.date in uniqeDates){
            //console.log('replacing', data[i-1], 'with ', ele);
            tested[i - 1] = ele.tested;
            positive[i -1] = ele.cases.positive;
            deaths[i - 1] = ele.cases.deaths;
            discharged[i - 1] = ele.cases.discharged;
        }else{
            categories.push(`Day ${i}`);
            tested.push(ele.tested);
            positive.push(ele.cases.positive);
            discharged.push(ele.cases.discharged);
            deaths.push(ele.cases.deaths);
            uniqeDates[ele.date] = true;
            i++;
        }
    }


    return {
        categories,
        deaths,
        tested,
        positive,
        discharged,
    };
}

function displayLineChart(chartData){

   let {categories, tested, positive, discharged, deaths} = convertToLineData(chartData);

   let style = {
        fontFamily: 'monospace',
        color: "white",
        fontSize: "15px"
    };

    let dataLabels = {
        style:{
            fontSize: "15px"
        }
    }
    
   Highcharts.chart('linechart', {
    chart: {
        type: 'line',
        backgroundColor:'transparent',
        height: '500px',
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 0
        }
    },
    title: {
        text: undefined,
        style,
        useHtml: true,
    },
    tooltip: {
        pointFormat: '<b>{point.y} cases were {point.series.name}</b>'
    },
    xAxis: {
        categories,
        labels: {
            style
        }
    },
    yAxis: {
        title: {
            text: undefined,
            useHtml: true,
            style:{
                color: 'white',
                fontSize :'12px'
            },
        },
        labels: {
            enabled: false
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true,
                style: {
                fontFamily: 'monospace',
                color: "white"
            }
        },
        enableMouseTracking: true,

        }
    },
    legend : {
    	itemStyle:{
      	color: 'white'
      }
    },
    series: [
      {
          name: 'Positive',
          data: positive,
          dataLabels,
          label:{
             enabled: false,
          }
      },
      {
          name: 'Tested',
          data: tested,
          dataLabels,
          label:{
             enabled: false,
          }
      },
       {
          name: 'Deaths',
          data: deaths,
          dataLabels,
          label:{
             enabled: false,
          }
      },
      {
          name: 'Discharged',
          data: discharged,
          dataLabels,
          label:{
             enabled: false,
          }
      }
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: '800px'
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
});

}

function displayPieChart({cases}){
    let data = [
         {
            name: 'Positive',
            y: cases.positive
        },
        {
            name: "Deaths",
            y: cases.deaths,
        },
        {
            name: "Dischagred",
            y: cases.discharged,
        },
    ]

    let style = {
        fontFamily: 'monospace',
        color: "white",
        fontSize: "15px"
    };

    Highcharts.chart('piechart', {
    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        zoomType:'xy'
    },
    title: {
        text: undefined,
        style,
        useHtml: true,
    },
    tooltip: {
        pointFormat: '<b>{point.y} cases {point.name}</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    legend : {
    	itemStyle:{
      	color: 'white'
      }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Cases',
        colorByPoint: true,
        data,
    }]
});
}