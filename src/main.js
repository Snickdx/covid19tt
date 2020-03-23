function convertToLineData(data){
    let categories = [];
    let tested = [];
    let imported = [];
    let deaths = [];
    let community = [];

    let uniqeDates = {};

    let i =0;
    for (let ele of data){
        if(ele.date in uniqeDates){
            //console.log('replacing', data[i-1], 'with ', ele);
            tested[i -1] = ele.tested;
            imported[i -1] = ele.cases.imported;
            deaths[i - 1] = ele.cases.deaths;
            community[i - 1] = ele.cases.community;
        }else{
            categories.push(`Day ${i}`);
            tested.push(ele.tested);
            imported.push(ele.cases.imported);
            deaths.push(ele.cases.deaths);
            community.push(ele.cases.community);
            uniqeDates[ele.date] = true;
            i++;
        }
    }


    return {
        categories,
        imported,
        deaths,
        tested,
        community,
    };
}

function displayLineChart(chartData){

   let {categories, tested, imported, community} = convertToLineData(chartData);

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
          name: 'Imported',
          data: imported,
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
          name: 'Community',
          data: community,
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
            name: 'Imported',
            y: cases.imported
        },
        {
            name: "Community",
            y: cases.community,
        }
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
        pointFormat: '<b>{point.y} persons tested positive are {point.name}</b>'
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

function getReportHistory(){
    return data = [
        {
            "date":1583884800,
            "update-num":14,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3195048907191562/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":0,
                "community":0
            },
            "tested":40
        },
        {
            "date":1583971200,
            "update-num":18,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3198283573534762/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":1,
                "community":0
            },
            "tested": 52
        },
        {
            "date":1584057600,
            "update-num":20,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3200040596692393/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":1,
                "community":0
            },
            "tested": 63
        },
        {
            "date":1584144000,
            "update-num":22,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3202589956437457/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":2,
                "community":0
            },
            "tested": 63
        },
        {
            "date":1584230400,
            "update-num":23,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3204012812961838/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":2,
                "community":0
            },
            "tested": 77
        },
            {
            "date":1584230400,
            "update-num":24,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3204612326235220/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":2,
                "community":0
            },
            "tested":81
        },
            {
            "date":1584230400,
            "update-num":25,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3205152302847889/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":4,
                "community":0
            },
            "tested": 81
        },
            {
            "date":1584316800,
            "update-num": 27,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3207001969329589/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 4,
                "community":0
            },
            "tested": 84
        },
            {
            "date": 1584316800,
            "update-num": 28,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3207431949286591/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":5,
                "community":0
            },
            "tested": 84
        },
        {
            "date": 1584403200,
            "update-num": 29,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3209075915788861/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 5,
                "community":0
            },
            "tested": 96
        },
        {
            "date": 1584403200,
            "update-num":30,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3209290455767407/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 5,
                "community":0
            },
            "tested": 110
        },
            {
            "date": 1584403200,
            "update-num": 31,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3210026749027111/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 7,
                "community":0
            },
            "tested": 110
        },
        {
            "date": 1584489600,
            "update-num": 32,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3211149152248204/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 7,
                "community":0
            },
            "tested": 131
        },
        {
            "date":1584489600,
            "update-num":34,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3212515568778229/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":9,
                "community":0
            },
            "tested": 131
        },
        {
            "date":1584576000,
            "update-num":35,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3213683695328083/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 9,
                "community":0
            },
            "tested": 150
        },
        {
            "date":1584576000,
            "update-num":36,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3214183925278060/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":9,
                "community":0
            },
            "tested":155
        },
        {
            "date":1584662400,
            "update-num":37,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3215879055108547/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":9,
                "community":0
            },
            "tested":250
        },
        {
            "date":1584662400,
            "update-num": 38,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3216553595041093/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported":9,
                "community":0
            },
            "tested": 258
        },
        {
            "date": 1584748800,
            "update-num": 40,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3219022014794251/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 49,
                "community":0
            },
            "tested": 284
        },
        {
            "date": 1584835200,
            "update-num": 41,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.153051404724676/3220704667959319/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 50,
                "community":0
            },
            "tested": 298
        },
        {
            "date": 1584835200,
            "update-num": 42,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/a.2717096131653511/3221450544551398/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 50,
                "community":0
            },
            "tested": 306
        },
        {
            "date": 1584921600,
            "update-num": 43,
            "url":"https://www.facebook.com/MinistryofHealthTT/photos/pcb.3223287184367734/3223287027701083/?type=3&theater",
            "cases":{
                "deaths": 0,
                "imported": 51,
                "community":0
            },
            "tested": 311
        }
    ];
}

function registerSW(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    }
}

function displayLastRecord(data){
    document.querySelector('#cases').innerHTML = data.cases.imported + data.cases.community;
    document.querySelector('#date').innerHTML = new Date(data.date*1000).toLocaleDateString('en-US');
    document.querySelector('#update-num').innerHTML = data['update-num'];
}

function displayMedia(data){

    let str = "";

    for(let ele of data){
        str+=`
        <div class="card">
            <div class="card-content black-text">
                <span class="card-title">Update #: ${ele['update-num']}</span>
                <p>Date: ${(new Date(ele.date*1000)).toLocaleDateString('en-US')}</p>
                <p>Tested: ${ele.tested}</p>
                <p>Imported Cases: ${ele.cases.imported}</p>
                <p>Community Cases: ${ele.cases.community}</p>
            </div>
            <div class="card-action">
            <a href="${ele.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>
            </div>
        </div>
        `;
    }

    document.querySelector('#media').innerHTML = str;
}

function fixAccessbility(){
    let img = document.querySelector('.highslide-container>img');
    img.setAttribute('alt', 'highslide container image');
    img.setAttribute('aria-hidden', true);
}

function main(){
    M.Tabs.init(document.querySelector(".tabs"));
    let reports = getReportHistory();

    displayLineChart(reports);

    let lastRec = reports.reverse()[0];
    displayPieChart(lastRec);
    displayLastRecord(lastRec);
    displayMedia(reports);
    fixAccessbility();
    registerSW();
}


window.addEventListener('load', main);