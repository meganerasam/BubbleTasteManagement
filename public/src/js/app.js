var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function () {
      console.log('SW Registered from app.js ');
    });
}

//Set up "Install Banner" and override the default one
window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

window.addEventListener('appinstalled', (evt) => {
  console.log('PWA installed');
});

function configurePushSub() {
  console.log('number of notif link 3 ' + enableNotificationsButtons.length);
  if (!('serviceWorker' in navigator)) {
    return;
  }

  var reg;
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub === null) {
        //Create new subscription
        var vapidPublicKey = 'BCur9hz52C3vbSZkJgEUowh-XD5D88HsCVcaFNac4atc1UwQjzUoIwLUPCZhlpxJqXaF8EM5q6ZzRPvq5-pzqTg';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);

        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        })
      }
      else {
        //We have a subscription
      }
    })
    .then(function (newSub) {
      return fetch('https://bubble-tastea-management.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(function (res) {
      console.log('Res ' + res);
      if (res.ok) {
        displayConfirmationNotification();
      }
    })
    .catch(function (err) {
      console.log(err);
    })
}

function askForNotificationPermission2() {
  Notification.requestPermission()
    .then(function (result) {
      if (result !== 'granted') {
        console.log('Not allowed');
      } else {
        configurePushSub();
        //displayConfirmationNotification();
      }
    })
    .catch(function (err) {
      console.log('Error from FCM ' + err.message);
    })
}

// function askForNotificationPermission() {
//   console.log('number of notif link 2 ' + enableNotificationsButtons.length);
//   Notification.requestPermission(function (result) {
//     console.log('User choise', result);
//     if (result !== 'granted') {
//       console.log('Not allowed');
//     } else {
//       configurePushSub();
//       //displayConfirmationNotification();
//     }
//   })
// }

function displayConfirmationNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'You successfully subscribed to our Notification service !',
      icon: '/src/images/icons/logo_96x96.png',
      action: [
        { action: 'confirm', title: 'Okay' },
        { action: 'cancel', title: 'Cancel' }
      ]
      //More options in lecture 150
    };
    navigator.serviceWorker.ready
      .then(function (swreg) {
        swreg.showNotification('Successfully  subscribed!', options);
      });
  }
}

// if ('Notification' in window) {
//   console.log('number of notif link 1 ' + enableNotificationsButtons.length);
//   for (var i = 0; i < enableNotificationsButtons.length; i++) {
//     enableNotificationsButtons[i].style.display = 'inline-block';
//     enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
//   }
// }


