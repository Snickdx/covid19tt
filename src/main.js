let selected;

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
    document.querySelector('#updateNum').innerHTML = data['updateNum'];
}

function displayMedia(data){

    let str = "";

    for(let ele of data){
        str+=`
        <div class="card">
            <div class="card-content black-text">
                <span class="card-title">Update #: ${ele['updateNum']}</span>
                <p>Date: ${(new Date(ele.date*1000)).toLocaleDateString('en-US')}</p>
                <p>Tested: ${ele.tested}</p>
                <p>Contact: ${ele.contact}</p>
                <p>Imported Cases: ${ele.cases.imported}</p>
                <p>Community Cases: ${ele.cases.community}</p>
            </div>
            <div class="card-action">
                <a href="${ele.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>
                <a href="#deleteModal" class="modal-trigger red-text darken-2" onclick="selected = ${ele.id}" style="font-weight: 700">Delete</a>
            </div>
        </div>
        `;
    }

    document.querySelector('#media-list').innerHTML = str;
}

function fixAccessbility(){
    let img = document.querySelector('.highslide-container>img');
    img.setAttribute('alt', 'highslide container image');
    img.setAttribute('aria-hidden', true);
}

function postData(data){
    //make post request
    getData();
}

function deleteData(){
    //make delete request
    getData();
}

function createReport(event){
    //get data from form and pass to postData
    event.preventDefault();
    let form = event.target.elements;
    let report = {
        password: form['password'],
        updateNum: form['updateNum'],
        url: form['url'],
        date: form['date'],
        cases: {
            deaths: form['deaths'],
            imported: form['imported'],
            community: form['community'],
        },
        tested: form['tested']
    };
    postData(report);
}

function deleteReport(event){
    //get data form form and make delete request
    console.log(selected);//selected is the id of the recored selected for deteletion
    event.preventDefault();
    let form = event.target.elements;
    let data = {
        id: selected,
        password: form['password']
    }
    deleteData(data);
}

function getData(){
    //make get request for data
    let records = getReports();

    //pass the records to this function
    displayLineChart(records);

    let lastRec = records.reverse()[0];
    
    //pass the records to this function in reverse order
    displayMedia(records);

    //pass the latest record to these functions
    displayPieChart(lastRec);
    displayLastRecord(lastRec);
}

function main(){
    M.Tabs.init(document.querySelector(".tabs"));
    const addModal = M.Modal.init(document.querySelector('#addModal'));

    // https://materializecss.com/modals.html
    const deleteModal = M.Modal.init(document.querySelector('#deleteModal'), {
        onOpenStart : function(){
            document.querySelector("#selected").innerHTML = selected;
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location).searchParams.get('url');
        document.querySelector('#url').value = url;
    });


    document.forms['createForm'].addEventListener('submit', createReport);
    document.forms['deleteForm'].addEventListener('submit', deleteReport);

    getData();

    
    fixAccessbility();
    registerSW();
}


window.addEventListener('load', main);