importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');


var CACHE_STATIC_NAME = 'static-v6';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';
var STATIC_ASSETS = [
  // Never pre-cache sw.js bc in case of update version
  // of it, it won't consider the new one but only the old one
  // so lead to unupdated version of the app and an infinite loop
  "/",
  "/index.html",
  "/offline.html",
  "/sidebar.html",
  "/src/js/app.js",
  "/src/js/fetch.js",
  "/src/js/promise.js",
  "/src/js/idb.js",
  "/src/pointes_aux_sables/stock_pointes_aux_sables.js",
  "/src/taiwan/order_taiwan.js",
  "/src/js/sidebar.js",
  "/src/js/auth.js",
  "/src/css/material-index.css",
  "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons",
  "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css",
  "/src/images/logo_95.png"
]

// Define pre-cached assets
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_ASSETS);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  //Update Cache Version
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          // If cache name does not match, it means that cache has been updated  
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});


// Improve the "cache only" URL checking strategy
function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;

  // for (var i = 0; i < array.length; i++) {
  //   if (array[i] === string) {
  //     return true;
  //   }
  // }

  // return false;
}


// Use the Cache then Network Strategy with Network fallback and dynamic caching
self.addEventListener('fetch', function (event) {
  var url = 'https://bubble-tastea-management.firebaseio.com/Item.json';
  if (event.request.url.indexOf(url) > -1) {

    console.log("fetch from sw.js");

    event.respondWith(fetch(event.request)
      .then(function (res) {
        // Store the response in indexDB
        var cloneRes = res.clone();
        // Need to clear the indexedDB before repopulating it becuase of possible data inconsistency
        // If an object is deleted from the db (firebase), the change might not be immediately
        // reflected into the app       
        clearAllData('pas')
          .then(function () {
            console.log("clearAllDara from sw.js");
            return cloneRes.json();
          })
          .then(function (data) {
            console.log("writeData from sw.js");
            for (var key in data) {
              writeData('pas', data[key]);
            }
          });
        return res;
      })
    );
  } else if (isInArray(event.request.url, STATIC_ASSETS)) {
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }
                  });
              });
          }
        })
    );
  }
})

self.addEventListener('sync', function (event) {
  var today = new Date();
  var date = (today.getMonth() + 1) + "/" + today.getFullYear();
  console.log('[Service Worker] Backgroundsyncing', event);
  if (event.tag == 'sync-taiwan-order') {
    console.log('[Service Worker] Syncing new Order');
    event.waitUntil(
      readAllData('sync-order')
        .then(function (data) {
          for (var dt of data) {
            var title = dt.name + " (" + dt.id_i + ")";
            var idi = dt.id_i + (today.getMonth() + 1) + "/" + today.getFullYear();
            fetch('https://us-central1-bubble-tastea-management.cloudfunctions.net/storeOrderTaiwan', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                id: dt.id,
                name: dt.name,
                category: dt.category,
                to_order: dt.to_order,
                id_item: dt.id_i
              })
              // body: JSON.stringify({
              //   [title]: {
              //     id: idi,
              //     name: dt.name,
              //     category: dt.category,
              //     to_order: dt.to_order,
              //     id_item: dt.id_i,
              //     date_order: date
              //   }
              // })
            })
              .then(function (res) {
                console.log('Sent Data', res);
                if (res.ok) {
                  res.json()
                    .then(function (resData) {
                      deleteItemFromData('sync-order', resData.id);
                    });
                }
              })
              .catch(function (err) {
                console.log('Eror while sending data', err);
              });
          }
        })
    )
  }
})


self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confrm was chosen');
    notification.close();
  }
  else {
    console.log(action);

    event.waitUntil(
      clients.matchAll()
        .then(function(clis){
          var client = clis.find(function(c){
            return c.visibilityState === 'visible';
          });

          if(client !== undefined){
            client.navigate(notification.data.url);
            client.focus();
          }
          else{
            clients.openWindow(notification.data.url);
          }
        })
    );
  }
});

self.addEventListener('notificationclose', function (event) {
  console.log('Notif closed', event);
});

self.addEventListener('push', function (event) {
  console.log('Push Notification received', event);

  var data = { title: 'New', content: 'Smth new happened', openUrl:'/' };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    data: {
      url: data.openUrl
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// //function to allow the app the work offline based on 
// // items that are pre-cached
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function (response) {
//         if (response) {
//           return response;
//         }
//         // Create a dynamic caching to allow items that are fetched
//         // from the internet while the user is navigating into the app
//         // and not yet stored into the pre-cache to be cahced
//         else {
//           return fetch(event.request)
//             .then(function (res) {
//               // Create a cache named 'dynamic' is it does not exist yet
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function (cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             // Instead of outputting an error message while accessing page offline
//             // use offline fallback page (which is "offline.html")
//             .catch(function (err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function (cache) {
//                   if (event.request.headers.get('accept').includes('text/html')) {
//                     return cache.match("/offline.html");
//                   }
//                 })
//             });
//         }
//       })
//   );
// });
