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

async function requestNotifications(messaging){
 const server = "https://us-central1-snickbox-203303.cloudfunctions.net";
   
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

async function tokenRefresh(messaging){
    try{
        const refreshedToken = await messaging.getToken();
        localStorage.set('covid-token', refreshedToken);
    }catch(e){
        console.log('Unable to retrieve refreshed token ', err);
    }
}

async function deleteToken(messaging){
    const currentToken = await messaging.getToken();
    messaging.deleteToken(currentToken);
    localStorage.removeItem('covid-token');
    toast('Notifications Disabled!');
}

function toggleMsg(event, messaging){
    const enabled = event.target.checked;
    if(enabled){
        requestNotifications(messaging);
    }else{
        deleteToken(messaging);
    }
}

async function checkAlertStatus(){
    let checkbox = document.querySelector('#msgEnabled');
    checkbox.checked = localStorage.getItem('covid-token') !== null;
}

async function foregroundMsg(payload, toast){
    console.log('Foreground Message: ', payload);
    toast("Notification Received");
}

function registerSW(messaging){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered');
            messaging.useServiceWorker(registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    }
}

export { toggleMsg, tokenRefresh,  checkAlertStatus, foregroundMsg, registerSW }