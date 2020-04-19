let selected;
let messaging;
let addModal;
let deleteModal;
let auth;

const db = firebase.firestore();

const releasesRef = db.collection("releases");

var ui = new firebaseui.auth.AuthUI(firebase.auth());

// const server = "https://5001-ca298c3b-c43c-48c2-a4b3-3591bce75459.ws-us02.gitpod.io/snickbox-203303/us-central1";
const server = "https://us-central1-snickbox-203303.cloudfunctions.net";

addModal = M.Modal.init(document.querySelector('#addModal'));

deleteModal = M.Modal.init(document.querySelector('#deleteModal'), {
    onOpenStart : function(){
        document.querySelector("#selected").innerHTML = selected;
    }
});

loginModal = M.Modal.init(document.querySelector('#loginModal'), {
    onOpenStart:login
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
    document.querySelector('#cases').innerHTML = data.cases.positive;
    document.querySelector('#date').innerHTML = new Date(data.date*1000).toLocaleDateString('en-US');
    document.querySelector('#updateNum').innerHTML = data.id;
}

function displayMedia(data){

    let str = "";

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

async function postData(url, data){
    try{
        let response = await fetch(
            url, 
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            },//convert data to JSON string
        );//1. Send http request and get response
        return response.json();
    }catch(error){
        return error;
    }
}

function deleteData(){
    //make delete request
    getData();
}

async function createReport(event){
    //get data from form and pass to postData
    event.preventDefault();
    let form = event.target.elements;
    let report = {
        id: form['updateNum'].value,
        url: form['url'].value,
        date: form['date'].value,
        cases: {
            deaths: form['deaths'].value,
            positive: form['positive'].value,
            discharged: form['discharged'].value,
        },
        notify: form['notify'].value,
        tested: form['tested'].value
    };

    const result = await db.collection('releases').doc(report.id).set(report);
    console.log(report.id, result);
    
    
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

async function getData(){
    const snapshot = await releasesRef.get();
    let records = [];
    snapshot.forEach(doc => {
        records.push(doc.data());
    });

    //pass the records to this function
    displayLineChart(records);

    let lastRec = records.reverse()[0];
    
    //pass the records to this function in reverse order
    displayMedia(records);

    //pass the latest record to these functions
    displayPieChart(lastRec);
    displayLastRecord(lastRec);
}

/// Notifications ******************************
async function requestNotifications(){
   
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    localStorage.setItem('covid-token', token);
    let res = await postData(`${server}/subscribe`, {token});
    console.log(token, res);
    toast('Notifications Enabled!');
  } catch (error) {
    console.error(error);
  }

}

async function tokenRefresh(){
    try{
        const refreshedToken = await messaging.getToken();
        localStorage.set('covid-token', refreshedToken);
    }catch(e){
        console.log('Unable to retrieve refreshed token ', err);
    }
}

async function deleteToken(){
    const currentToken = await messaging.getToken();
    messaging.deleteToken(currentToken);
    localStorage.removeItem('covid-token');
    toast('Notifications Disabled!');
}

function toggleMsg(event){
    const enabled = event.target.checked;
    if(enabled){
        requestNotifications();
    }else{
        deleteToken();
    }
}

async function checkAlertStatus(){
    let checkbox = document.querySelector('#msgEnabled');
    checkbox.checked = localStorage.getItem('covid-token') !== null;
}

async function foregroundMsg(payload){
    console.log('Message: ', payload);
}
//End Notifications ************************************************* */

function login(modal){ 
    ui.start('#authContainer', 
            {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    auth = authResult;
                    loginModal.close();
                }
            },
            signInFlow: 'popup',
            signInSuccessUrl: '#',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            tosUrl: 'https://covid19tt.web.app',
            privacyPolicyUrl: 'https://covid19tt.web.app'
        }
    );
}

function getAuth(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            auth = user;
            console.log('logged in');
        } else {
            console.log('not logged in');
        }
    });
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
    document.querySelector('#loginBtn').addEventListener('click', login);
    document.forms['createForm'].addEventListener('submit', createReport);
    document.forms['deleteForm'].addEventListener('submit', deleteReport);

    getAuth();
    getData();
    fixAccessbility();
    registerSW();
    checkAlertStatus();
}


window.addEventListener('load', main);