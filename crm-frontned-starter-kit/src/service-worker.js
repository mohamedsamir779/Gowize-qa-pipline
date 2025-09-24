
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  console.log("FFFFFFFF: service worker message", event);
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.

self.addEventListener("activate", function (event) {
  console.log("FFFFFFFF: service worker activated");
});

self.addEventListener("push", async function (event) {
  console.log("FFFFFFF notifications will be displayed here");
  const message = await event.data.json();
  let { title, body, icon, data } = message;
  console.log({ message });
  const channel = new BroadcastChannel("notification--exinitic--messages");
  channel.postMessage(message);
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      subtitle: "test subtitle",
      "click_action": "localhost:3000/dashboard",
      "tag": "testing tag",
      data,
      // data: {
      //   url: "http://localhost:3000/dashboard"
      // }
    })
  );
});

self.addEventListener("notificationclose", function (e) {
  var notification = e.notification;
  var data = notification.data || {};
  var primaryKey = data.primaryKey;
  console.log("Closed notification: " + primaryKey);
});

self.addEventListener("notificationclick", function (e) {
  e.preventDefault();
  var notification = e.notification;
  var data = notification.data || {};
  var primaryKey = data.primaryKey;
  var action = e.action;
  console.log("Clicked notification: " + JSON.stringify(notification));
  console.log("Clicked notification: " + JSON.stringify(e));
  console.log("Clicked notification: " + JSON.stringify(data));
  console.log("Clicked notification: " + primaryKey);
  e.waitUntil(
    clients.openWindow(data.crmClickUrl)
  );
  if (action === "close") {
    console.log("Notification clicked and closed", primaryKey);
    notification.close();
  }
  else {
    console.log("Notification actioned", primaryKey);
    notification.close();
  }
});