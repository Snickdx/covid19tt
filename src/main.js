let selected;
let messaging;
let addModal;
let deleteModal;

addModal = M.Modal.init(document.querySelector('#addModal'));

deleteModal = M.Modal.init(document.querySelector('#deleteModal'), {
    onOpenStart : function(){
        document.querySelector("#selected").innerHTML = selected;
    }
});

M.Tabs.init(document.querySelector(".tabs"));

function registerSW(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
            firebase.messaging().useServiceWorker(registration);
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

async function requestNotifications(){
   
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log(token);
  } catch (error) {
    console.error(error);
  }

}

async function getMsgToken(){
    try{
        const currentToken = await messaging.getToken();
        if (currentToken) {
            //sendTokenToServer(currentToken);
            //updateUIForPushEnabled(currentToken);
            return currentToken;
        } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            //updateUIForPushPermissionRequired();
            //setTokenSentToServer(false);
        }
    }catch(e){
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
    }
}

async function tokenRefresh(){

    try{
        const refreshedToken = await messaging.getToken();
        // app server.
        //setTokenSentToServer(false);
        // Send Instance ID token to app server.
        //sendTokenToServer(refreshedToken);
    }catch(e){
        console.log('Unable to retrieve refreshed token ', err);
        //showToken('Unable to retrieve refreshed token ', err);
    }

}

function toggleMsg(event){
    const enabled = event.target.checked;
    if(enabled){
        requestNotifications();
    }
}

async function foregroundMsg(payload){
    console.log('Message: ', payload);
}

function toast(message){
    M.toast({html: message});
}

function main(){
    messaging = firebase.messaging();
    messaging.usePublicVapidKey("BAqoB57ExCmPU2hHer0NWSqTsHgAABG78b0IB_KkAqfAg63k9MG8Q8vqXETs0wDcBckFbsTUs191L39nW7M-EsU");
    messaging.onTokenRefresh(tokenRefresh);
    messaging.onMessage(foregroundMsg);

    document.querySelector('#msgEnabled').addEventListener('click', toggleMsg);
    document.forms['createForm'].addEventListener('submit', createReport);
    document.forms['deleteForm'].addEventListener('submit', deleteReport);

    getData();
    fixAccessbility();
    registerSW();
}


window.addEventListener('load', main);