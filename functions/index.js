const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});

// admin.initializeApp({
//     credential: admin.credential.cert('./sa.json'),
//     databaseURL: "https://snickbox-203303.firebaseio.com"
// });

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.subscribe = functions.https.onRequest(async (request, response) => {
    const {token} = request.body;
    return cors(request, response, async ()=>{
        if(request.body.token){
            try{
                let res = await admin.messaging().subscribeToTopic(request.body.token, 'covid_alerts');
                response.send(res);
            }catch(e){
                console.error(e);
                response.send(e);
            }
        }
    });
});


exports.sendAlert = functions.firestore.document('/releases/{documentId}').onCreate(async (snap, context) => {

      const release = snap.data();
      let {positive, deaths} = release.cases;
      console.log(release);
      
      if(release.notify){
          try{
             const message = {
                notification : {
                    "title":`Covid19TT Alert: #${release.id} Released`,
                    "body": `Tested: ${release.tested}\n Positive: ${positive}\n Deaths: ${deaths}`,
                    "image": "https://covid19tt.web.app/assets/img/512.png"
                },
                topic: 'covid_alerts',
                webpush: {
                    "fcm_options": {
                        "link": "https://covid19tt.web.app"
                    }
                }
            };
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
          }catch(e){
              console.error(e);
          }
      }

      return release.notify ? "Attempted Notification": "No notification sent";
});