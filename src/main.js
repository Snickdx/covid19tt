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
    
   Highcharts.chart('linechart', {
    chart: {
        type: 'line',
        backgroundColor:'transparent'
    },
    title: {
        text: 'Cases Since 11th March 2020',
        style
    },
    subtitle: {
        text: 'Source: MoH Facbook Page',
        style
    },
    xAxis: {
        categories,
        labels: {
            style
        }
    },
    yAxis: {
        title: {
            text: 'Total Number of Cases',
            style,
        },
        labels: {
            style
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
            enableMouseTracking: false
        }
    },
    legend : {
    	itemStyle:{
      	color: 'white'
      }
    },
    series: [
      {
          name: 'Confirmed Imported',
          data: imported,
          label:{
             style: {
                  fontFamily: 'monospace',
                  color: "white"
              }
          }
      },
      {
          name: 'Teststed',
          data: tested,
          label:{
             style: {
                  fontFamily: 'monospace',
                  color: "white"
              }
          }
      },
       {
          name: 'Community',
          data: community,
          label:{
             style: {
                  fontFamily: 'monospace',
                  color: "white"
              }
          }
      }
    ]
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
        type: 'pie'
    },
    title: {
        text: 'Imported Vs Community Cases',
        style
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
            <a href="${ele.url}" rel="noopener" target="_blank" class="red-text">View on Facebook</a>
            </div>
        </div>
        `;
    }

    document.querySelector('#media').innerHTML = str;
}

function main(){
    M.Tabs.init(document.querySelector(".tabs"));
    let reports = getReportHistory();

    displayLineChart(reports);

    let lastRec = reports.reverse()[0];
    displayPieChart(lastRec);
    displayLastRecord(lastRec);
    displayMedia(reports);
    registerSW();
}


window.addEventListener('load', main);