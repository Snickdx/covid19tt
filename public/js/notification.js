async function postData(e,t){try{return(await fetch(e,{method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}})).json()}catch(e){return e}}async function requestNotifications(e){try{await e.requestPermission();const t=await e.getToken();localStorage.setItem("covid-token",t);let o=await postData("https://us-central1-snickbox-203303.cloudfunctions.net/subscribe",{token:t});console.log(t,o),toast("Notifications Enabled!")}catch(e){console.error(e)}}async function tokenRefresh(e){try{const t=await e.getToken();localStorage.set("covid-token",t)}catch(e){console.log("Unable to retrieve refreshed token ",err)}}async function deleteToken(e){const t=await e.getToken();e.deleteToken(t),localStorage.removeItem("covid-token"),toast("Notifications Disabled!")}function toggleMsg(e,t){e.target.checked?requestNotifications(t):deleteToken(t)}async function checkAlertStatus(){document.querySelector("#msgEnabled").checked=null!==localStorage.getItem("covid-token")}async function foregroundMsg(e,t){console.log("Foreground Message: ",e),t("Notification Received")}function registerSW(e){"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(t=>{console.log("SW registered"),e.useServiceWorker(t)}).catch(e=>{console.log("SW registration failed: ",e)})}export{toggleMsg,tokenRefresh,checkAlertStatus,foregroundMsg,registerSW};