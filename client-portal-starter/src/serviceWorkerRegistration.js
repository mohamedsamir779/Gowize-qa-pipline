/* eslint-disable no-console */
// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA
const LOG_PREFIX = "[ServiceWorker]";
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === "[::1]" ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  console.log(`${LOG_PREFIX} inside register SW`);
  if ("serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    console.log(`${LOG_PREFIX} public url: ${publicUrl}`);
    console.log(`${LOG_PREFIX} origin url: ${window.location.origin}`);
    console.log(`${LOG_PREFIX} equality url: ${publicUrl.origin !== window.location.origin}`);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      console.log(`${LOG_PREFIX} running localhost: isLocalhost : ${isLocalhost}`);
      if (isLocalhost) {
        console.log(`${LOG_PREFIX} running localhost: isLocalhost : ${isLocalhost}, swUrl: ${swUrl}`);
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
            "worker. To learn more, visit https://cra.link/PWA"
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(LOG_PREFIX,
                "New content is available and will be used when all " +
                "tabs for this page are closed. See https://cra.link/PWA."
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log(`[${LOG_PREFIX}] Content is cached for offline use.`);

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error(`[${LOG_PREFIX}] Error during service worker registration:`, error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  console.log(`${LOG_PREFIX} inside checkValidServiceWorker SW`);
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      console.log(`${LOG_PREFIX} inside checkValidServiceWorker SW: response:`, response);
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      console.log(`${LOG_PREFIX} inside checkValidServiceWorker SW: contentType:`, contentType);
      console.log(`${LOG_PREFIX} inside checkValidServiceWorker SW: response.status:`, response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1));
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        console.log(`${LOG_PREFIX} inside checkValidServiceWorker SW: unregistering SW`);
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(`[${LOG_PREFIX}] No internet connection found. App is running in offline mode.`);
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

export function subscribeUserToPush() {
  console.log(`${LOG_PREFIX} Inside subs to push.`);
  return navigator.serviceWorker.ready.then((serviceWorkerReg) => {
    console.log(`${LOG_PREFIX} Service Worker Ready`);
    return serviceWorkerReg.pushManager.getSubscription().then((subscription) => {
      console.log(`${LOG_PREFIX} Service Worker Ready: subscription:`, subscription);
      if (subscription === null) {
        return serviceWorkerReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BJT_vxXDhe1RmUxC_e7oGoHj5L2aPNHxhGtDqPAQmlyfnX3ldlHPaC8Bhy1hu8WzAG_2F3qsiBLm-Z7I7pE3zYE",
        }).then((newSubs) => {
          console.log(`${LOG_PREFIX} User is subscribed.`);
          console.log(LOG_PREFIX, newSubs);
          return newSubs;
        }).catch((err) => {
          console.log(`${LOG_PREFIX} Failed to subscribe the user: `, err);
        });
      } else {
        console.log(`${LOG_PREFIX} User is already subscribed.`);
        return subscription;
      }
    });
  });
  // const subscription = serviceWorkerReg.pushManager.getSubscription();
  // console.log(`${LOG_PREFIX} Service Worker Ready: subscription:`, subscription);
  // if (subscription === null) {
  //   serviceWorkerReg.pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: "BKemtwM7irZVq7QiMjpIvx_pioe-DDN-T2mdceu_bE57MjttTD_BPmZYrnUfyNaQsOJ28oub9l_-UW8yqBDo",
  //   }).then((subscription) => {
  //     console.log(`${LOG_PREFIX} User is subscribed.`);
  //     console.log(LOG_PREFIX, subscription);
  //   }).catch((err) => {
  //     console.log(`${LOG_PREFIX} Failed to subscribe the user: `, err);
  //   });
  // }
}

export function checkPushNotificationSubscription() {
  console.log(`${LOG_PREFIX} Inside check subs to push.`);
  return navigator.serviceWorker.ready.then((serviceWorkerReg) => {
    return serviceWorkerReg.pushManager.getSubscription().then((subscription) => {
      console.log(`${LOG_PREFIX} Service Worker Ready: subscription:`, subscription);
      if (subscription === null) {
        console.log(`${LOG_PREFIX} User is not subscribed.`);
        return false;
      } else {
        console.log(`${LOG_PREFIX} User is already subscribed.`);
        return true;
      }
    });
  });
}

export function unsubscribeFromPushNotification() {
  console.log(`${LOG_PREFIX} Inside unsub to push.`);
  return navigator.serviceWorker.ready.then((serviceWorkerReg) => {
    return serviceWorkerReg.pushManager.getSubscription().then((subscription) => {
      if (subscription) {
        return subscription.unsubscribe().then(() => {
          console.log(`${LOG_PREFIX} User is unsubscribed.`);
          return subscription;
        }).catch((err) => {
          console.log(`${LOG_PREFIX} Failed to unsubscribe the user: `, err);
        });
      }
    });
  });
}
