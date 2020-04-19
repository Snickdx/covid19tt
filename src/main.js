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
                <a href="#" class="deleteBtn red-text darken-2" onclick="deleteData(${ele.id})" style="font-weight: 700; display:${auth ? "block":"none"}">Delete</a>
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

async function deleteData(id){
    
    try{
        const result = await db.collection('releases').doc(""+id).delete();
        console.log(id, result);
        toast('Report Deleted!');
    }catch(e){
        toast('Error: Insufficient Permissions');
        console.log(e);
    }
}

async function createReport(event){
    //get data from form and pass to postData
    event.preventDefault();
    let form = event.target.elements;
    let report = {
        id: parseInt(form['updateNum'].value),
        url: form['url'].value,
        date: Math.floor(new Date(form['date'].value).getTime() / 1000),
        cases: {
            deaths: parseInt(form['deaths'].value),
            positive: parseInt(form['positive'].value),
            discharged: parseInt(form['discharged'].value),
        },
        notify: form['notify'].value === 'on',
        tested: parseInt(form['tested'].value)
    };

    try{
        const result = await db.collection('releases').doc(""+report.id).set(report);
        console.log(report.id, result);
        toast('Report Added!');
    }catch(e){
        toast('Error: Insufficient Permissions');
    }
    
}


async function displayData(records){
    //pass the records to this function
    displayLineChart(records);

    let lastRec = records.reverse()[0];
    
    //pass the records to this function in reverse order
    await displayMedia(records);

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
    console.log('Foreground Message: ', payload);
    toast("Notification Received");
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

async function logout(){
    let res = await firebase.auth().signOut();
    console.log(res);
    toast('Logged Out!');
}

function getAuth(){

    const addFab = document.querySelector('#addFab');
    const loginBtn = document.querySelector('#loginBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    const deleteBtns = document.querySelectorAll('.deleteBtn');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            auth = user;
            addFab.style.display = "block";
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            deleteBtns.forEach( btn => btn.style.display = "block");
        } else {
            auth = undefined;
            addFab.style.display = "none";
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
            deleteBtns.forEach( btn => btn.style.display = "none");
        }
    });
}

function toast(message){
    M.toast({html: message});
}

function monitorCollection(){
    releasesRef.onSnapshot(querySnapshot => {
        records = [];
        querySnapshot.forEach(doc=>{
            records.push(doc.data());
        })
        displayData(records);
    });
}

async function main(){
    messaging = firebase.messaging();
    messaging.usePublicVapidKey("BAqoB57ExCmPU2hHer0NWSqTsHgAABG78b0IB_KkAqfAg63k9MG8Q8vqXETs0wDcBckFbsTUs191L39nW7M-EsU");
    messaging.onTokenRefresh(tokenRefresh);
    messaging.onMessage(foregroundMsg);

    document.querySelector('#msgEnabled').addEventListener('click', toggleMsg);
    document.querySelector('#loginBtn').addEventListener('click', login);
    document.querySelector('#logoutBtn').addEventListener('click', logout);
    document.forms['createForm'].addEventListener('submit', createReport);

    const snapshot = await releasesRef.get();
    let records = [];
    snapshot.forEach(doc => {
        records.push(doc.data());
    });

    displayData(records);
    getAuth();
    monitorCollection();
    fixAccessbility();
    registerSW();
    checkAlertStatus();
}


window.addEventListener('load', main);