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

workbox.precaching.precacheAndRoute([{"revision":"f750350fa494206908b0bbad5a76b15e","url":"assets/img/192.png"},{"revision":"061645dec4145a79727e6da9ddfb900f","url":"assets/img/512.png"},{"revision":"2fb9a7b8272296ef8b76e7eec908b597","url":"assets/img/favicon.ico"},{"revision":"33d6308368e200a199a5376ae5f62312","url":"assets/img/maskable-512.png"},{"revision":"db33db2f661c65ec97ad76221ca179be","url":"charts.js"},{"revision":"9a800bd56c049120892ab36f98c22197","url":"index.html"},{"revision":"b9c8f0eafb666166fe02ce30fd4d908c","url":"main.css"},{"revision":"56b7bd49855226e60bbe6ed905a1fc2d","url":"main.js"},{"revision":"1ab40282be9eb2c0ae8d942b7244f5de","url":"sw-src.js"}]);
workbox.clientsClaim();
workbox.skipWaiting();

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
