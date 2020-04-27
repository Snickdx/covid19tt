export class DisplayManager{

    constructor(getUser, highcharts, toast){
        this.highcharts = highcharts;
        this.getUser = getUser;
        this.toast = toast;
    }

    displayLastRecord(data){
        document.querySelector('#cases').innerHTML = data.cases.positive;
        document.querySelector('#date').innerHTML = new Date(data.date*1000).toLocaleDateString('en-US');
        document.querySelector('#updateNum').innerHTML = data.id;
    }

    async deleteHandler(event, toast){
        let id = event.target.dataset.id;
        let db = firebase.firestore();
        console.log('Delete Handler');
        try{
            const result = await db.collection('releases').doc(""+id).delete();
            toast('Report Deleted!');
        }catch(e){
            toast('Error: Insufficient Permissions');
            console.log(e);
        }
    }

    async displayMedia(data){

        let str = "";

        let user = await this.getUser();

        for(let ele of data){
            str+=`
            <div class="card">
                <div class="card-content black-text">
                    <span class="card-title">Update #: ${ele.id}</span>
                    <p>Date: ${(new Date(ele.date*1000)).toLocaleDateString('en-US')}</p>
                    <p>Tested: ${ele.tested}</p>
                    <p>Current Positive Cases: ${ele.cases.positive}</p>
                    <p>Total Deaths Cases: ${ele.cases.deaths}</p>
                    <p>Total Discharged: ${ele.cases.discharged}</p>
                    <p>Deaths: ${ele.cases.deaths}</p>
                </div>
                <div class="card-action">
                    <a href="${ele.url}" rel="noopener" target="_blank" style="font-weight: 700; display:block; margin-bottom:5px" class="red-text white darken-2 waves-effect waves-light btn-small">View on Facebook</a>
                    <a href="#" class="deleteBtn  red white-text darken-2 waves-effect waves-light btn-small" data-id="${ele.id}" style="font-weight: 700; display:${user ? "block":"none"}">Delete</a>
                </div>
            </div>
            `;
        }

        document.querySelector('#media-list').innerHTML = str;

        const deleteBtns = document.querySelectorAll('.deleteBtn');
        for (let btn of deleteBtns){
            btn.addEventListener('click', (event) => this.deleteHandler(event, this.toast));
        }

    }

    convertToLineData(data){
        let categories = [];
        let tested = [];
        let positive = [];
        let deaths = [];
        let discharged = [];

        let uniqeDates = {};

        let i =0;
        for (let ele of data){
            if(ele.date in uniqeDates){
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

    displayLineChart(chartData){

        let {categories, tested, positive, discharged, deaths} = this.convertToLineData(chartData);

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
            
        this.highcharts.chart('linechart', {
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

    displayPieChart({cases}){
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

        this.highcharts.chart('piechart', {
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

    displayData(records){
        this.displayLineChart(records);
        let lastRec = records.reverse()[0];
        this.displayMedia(records);
        this.displayPieChart(lastRec);
        this.displayLastRecord(lastRec);
    }

    monitorCollection(releasesRef){
        releasesRef.onSnapshot(querySnapshot => {
            let records = [];
            querySnapshot.forEach(doc=>{
                records.push(doc.data());
            })
            this.displayData(records);
        });
    }

}