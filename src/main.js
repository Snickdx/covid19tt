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
                <p>Contact: ${ele.contact}</p>
                <p>Imported Cases: ${ele.cases.imported}</p>
                <p>Community Cases: ${ele.cases.community}</p>
            </div>
            <div class="card-action">
                <a href="${ele.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>
                <a href="#deleteModal" class="modal-trigger" style="font-weight: 700" class="red-text darken-2">Delete</a>
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


function main(){
    M.Tabs.init(document.querySelector(".tabs"));
    M.Modal.init(document.querySelectorAll('.modal'));

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