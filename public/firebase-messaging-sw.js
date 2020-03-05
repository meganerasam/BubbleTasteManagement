importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyD9_MU3Gg0QYsxhGP05KAun_-GOCZKv30c",
    authDomain: "bubble-tastea-management.firebaseapp.com",
    databaseURL: "https://bubble-tastea-management.firebaseio.com",
    projectId: "bubble-tastea-management",
    storageBucket: "bubble-tastea-management.appspot.com",
    messagingSenderId: "450906455494",
    appId: "1:450906455494:web:38c007ac76e9bf0d0ec6c7",
    measurementId: "G-T0DG53VPHX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
    const title = 'Hellow Notif';
    const option = {
        body:payload.data.status
    }
    return self.ServiceWorkerRegistration.showNotification(title, option);
});
