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

workbox.precaching.precacheAndRoute([{"revision":"f750350fa494206908b0bbad5a76b15e","url":"assets/img/192.png"},{"revision":"7a7d7292470f92e3279164cfcef7248b","url":"assets/img/512.png"},{"revision":"2fb9a7b8272296ef8b76e7eec908b597","url":"assets/img/favicon.ico"},{"revision":"33d6308368e200a199a5376ae5f62312","url":"assets/img/maskable-512.png"},{"revision":"db33db2f661c65ec97ad76221ca179be","url":"charts.js"},{"revision":"41a977cf5e71b40da06e05d0f5abe80d","url":"index.html"},{"revision":"c133104403cb8cca85fed805033adcdd","url":"main.css"},{"revision":"249f3e87a439c37aefa69cc99b33c21f","url":"main.js"},{"revision":"f97e3afb4def7a13b0636c417914eef1","url":"sw-src.js"}]);

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
