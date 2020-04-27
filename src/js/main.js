import { toggleMsg, tokenRefresh,  checkAlertStatus, foregroundMsg, registerSW } from './notification.js';
import { AuthManager } from './auth.js';
import { DisplayManager } from './display.js'


function fixAccessbility(){
    let img = document.querySelector('.highslide-container>img');
    img.setAttribute('alt', 'highslide container image');
    img.setAttribute('aria-hidden', true);
}

async function createReport(event, releasesRef){
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
        notify: form['notify'].checked,
        tested: parseInt(form['tested'].value)
    };

    try{
        const result = await releasesRef.doc(""+report.id).set(report);
        toast('Report Added!');
    }catch(e){
        toast('Error: Insufficient Permissions');
    }
    
}

async function getData(releasesRef){
    const snapshot = await releasesRef.get();
    let records = [];
    snapshot.forEach(doc => {
        records.push(doc.data());
    });
    return records;
}



function toast(message){
    M.toast({html: message});
}

async function main(){

    const db = firebase.firestore();
    const a = firebase.auth();

    const auth = new AuthManager(firebase.auth(), firebaseui, firebase.auth);

    const display = new DisplayManager(auth.getUser, Highcharts, toast);

    const messaging = firebase.messaging();

    messaging.usePublicVapidKey("BAqoB57ExCmPU2hHer0NWSqTsHgAABG78b0IB_KkAqfAg63k9MG8Q8vqXETs0wDcBckFbsTUs191L39nW7M-EsU");
    messaging.onTokenRefresh(()=>tokenRefresh(messaging));
    messaging.onMessage(foregroundMsg, toast);

    const releasesRef = db.collection("releases");
    const server = "https://us-central1-snickbox-203303.cloudfunctions.net";

    let records = await getData(releasesRef);
  
    const addModal = M.Modal.init(document.querySelector('#addModal'));

    const loginModal = M.Modal.init(
        document.querySelector('#loginModal'), 
        { 
            onOpenStart: async ()=>{
                user = await auth.login();
                loginModal.close();
            }
        }
    );

    const tabs = M.Tabs.init(document.querySelector(".tabs"));

    document.querySelector('#msgEnabled').addEventListener('click', event =>toggleMsg(event, messaging));
    document.querySelector('#logoutBtn').addEventListener('click', () => auth.logout(auth, toast));
    document.forms['createForm'].addEventListener('submit', event => createReport(event, releasesRef));

    display.displayData(records);
    display.monitorCollection(releasesRef);

    fixAccessbility();
    //registerSW(messaging);
    checkAlertStatus();
}


window.addEventListener('load', main);