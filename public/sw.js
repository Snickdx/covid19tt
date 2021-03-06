importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('/__/firebase/7.12.0/firebase-app.js');
importScripts('/__/firebase/7.12.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');

// https://www.freecodecamp.org/news/how-to-add-push-notifications-to-a-web-app-with-firebase-528a702e13e1/

const messaging = firebase.messaging();

const DEBUG = false;

workbox.setConfig({debug: DEBUG});

if(DEBUG)workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

if(!DEBUG)workbox.googleAnalytics.initialize();

const {registerRoute} = workbox.routing;
const {CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

workbox.precaching.precacheAndRoute([{"revision":"f8a87bb51cb864dda094fcf48948b2eb","url":"assets/coffin-dance.mp3"},{"revision":"f750350fa494206908b0bbad5a76b15e","url":"assets/img/192.png"},{"revision":"061645dec4145a79727e6da9ddfb900f","url":"assets/img/512.png"},{"revision":"2fb9a7b8272296ef8b76e7eec908b597","url":"assets/img/favicon.ico"},{"revision":"33d6308368e200a199a5376ae5f62312","url":"assets/img/maskable-512.png"},{"revision":"f8bc3e22744f56151522cff2e2a4b850","url":"index.html"},{"revision":"dc1ee82b5e69fc12bc4440ad42bb48d2","url":"js/auth.js"},{"revision":"5b55c1d96f498dff73fe90d75afe9438","url":"js/display.js"},{"revision":"5b2ac978bb1abb68a6967a6f859c87dd","url":"js/main.js"},{"revision":"aa91cec6d0ff7f2cfb42c551481e36c7","url":"js/notification.js"},{"revision":"b9c8f0eafb666166fe02ce30fd4d908c","url":"main.css"},{"revision":"f206aaac1b936c2b0bb5a1cfbd8d0b76","url":"manifest.json"}]);
// workbox.clientsClaim();
// workbox.skipWaiting();

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new CacheFirst({
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]})
    ],
  })
);


messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: './assets/img/192.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
