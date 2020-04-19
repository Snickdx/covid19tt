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
                let response = await admin.messaging().subscribeToTopic(request.body.token, 'covid_alerts');
                request.send(response);
            }catch(e){
                console.error(e);
                response.send(e);
            }
        }
    });
});


exports.sendAlert = functions.firestore.document('/releases/{documentId}')
    .onCreate((snap, context) => {

      const release = snap.data();
      let {positive, deaths} = release.cases;
      console.log(release);
      if(release.notify){
            var message = {
                notification : {
                    "title":`Covid19TT Alert: #${release.id} Released`,
                    "body": `Tested: ${release.tested}\n Positive: ${positive}\n Deaths: ${deaths}`,
                    "icon": "https://covid19tt.web.app/assets/img/512.png",
                    "requireInteraction": true
                },
                topic: 'covid_alerts',
                webpush: {
                    "fcm_options": {
                        "link": "https://covid19tt.web.app"
                    }
                }
            };

            admin.messaging()
                .send(message)
                .then((response) => {
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
      }

      return snap.ref.set({uppercase}, {merge: true});
      // [END makeUppercaseBody]
    });