var functions = require('firebase-functions');
var admin = require('firebase-admin');
//var messaging = require('firebase-messaging');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');

//   // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./bubble-tastea-fb-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bubble-tastea-management.firebaseio.com/'
})

exports.storeOrderTaiwan = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        var id_item = request.body.name + " (" + request.body.id + ")";
        admin.database().ref('Taiwan').push({
            id: request.body.id,
            name: request.body.name,
            category: request.body.category,
            order: request.body.to_order,
            id_item: request.body.id_item
        })
            .then(() => {
                //Add push notification to every subscribed client 
                //when Taiwa order is updated
                webpush.setVapidDetails('mailto:meganerasam@yahoo.fr',
                    'BCur9hz52C3vbSZkJgEUowh-XD5D88HsCVcaFNac4atc1UwQjzUoIwLUPCZhlpxJqXaF8EM5q6ZzRPvq5-pzqTg',
                    'TR2fkUd8AfJw6SVXxB8nHYBEkDnzG4MBWNP4-5xiVdo');

                //Send the push notif to all subscribed user by looping through
                //the BD
                return admin.database().ref('subscriptions').once('value');
            })
            .then((subscriptions) => {
                subscriptions.forEach((sub) => {
                    var pushConfig = {
                        endpoint: sub.val().endpoint,
                        keys: {
                            auth: sub.val().keys.auth,
                            p256dh: sub.val().keys.p256dh
                        }
                    };

                    webpush.sendNotification(pushConfig, JSON.stringify({
                        title: 'New Update Order',
                        content: 'New Order added',
                        openUrl: '/offline'
                    }))
                        .catch((err) => {
                            console.log(err);
                        })
                });
                response.status(201).json({ message: 'Data stored', id: request.body.id });
                return null;
            })
            .catch((err) => {
                response.json({ error: err });
            })
    })
});

exports.sendNotificationRefill = functions.database.ref('/AllStock/{Item_ID}').onUpdate((change, context) => {
    const itemID = context.params.Item_ID;
    const itemName = change.before.child('name').val();
    const itemCat = change.before.child('category').val();
    const itemQtyStart = change.before.child('start').val();
    const changeBefore = change.before.child('quantity').val();
    const changeAfter = change.after.child('quantity').val();
    var stockout = 0;
    var stockin = 0;
    var openNotifLandPage;
    var d = new Date();
    var day = d.getDate()
    var month = (d.getMonth() + 1)
    var year = d.getFullYear();
    var today = day + "-" + month + "-" + year
    console.log("Date " + day + " month " + month + " year " + year + " and today " + today);

    // Look for ID to define page to open on notification click
    if (itemID.charAt(0) === 'C') {
        openNotifLandPage = '/src/call_order/call_order.html';
    }
    else if (itemID.charAt(0) === 'I') {
        openNotifLandPage = '/src/intermart/to_buy_intermart.html';
    }
    else {
        openNotifLandPage = '/src/pointes_aux_sables/stock_pointes_aux_sables.html';
    }

    // Compare value of quantity before and after change to determine if the 
    // it is a stock out or a stock in based on stock value at the beginning of the day
    if (itemQtyStart > changeAfter) {
        stockout = itemQtyStart - changeAfter
        console.log('Stock out');
    }
    else if (itemQtyStart === changeAfter) {
        stockin = 0;
        stockout = 0;
        console.log('stock not changed');
    }
    else if (itemQtyStart < changeAfter) {
        stockin = changeAfter - itemQtyStart;
        console.log('Stock in');
    }

    // Save any change to the database for future analysis 
    admin.database().ref('stock-history').child(today).child(itemID).set({
        date: today,
        id: itemID,
        name: itemName,
        category: itemCat,
        currentQty: changeAfter,
        out: stockout,
        in: stockin
    })
        .then(() => {
            if (changeAfter <= 5) {
                //Add push notification to every subscribed client 
                //when Taiwa order is updated
                webpush.setVapidDetails('mailto:meganerasam@yahoo.fr',
                    'BCur9hz52C3vbSZkJgEUowh-XD5D88HsCVcaFNac4atc1UwQjzUoIwLUPCZhlpxJqXaF8EM5q6ZzRPvq5-pzqTg',
                    'TR2fkUd8AfJw6SVXxB8nHYBEkDnzG4MBWNP4-5xiVdo');

                //Send the push notif to all subscribed user by looping through
                //the BD
                return admin.database().ref('subscriptions').once('value');
            }
            return null
        })
        .then((subscriptions) => {
            subscriptions.forEach((sub) => {
                var pushConfig = {
                    endpoint: sub.val().endpoint,
                    keys: {
                        auth: sub.val().keys.auth,
                        p256dh: sub.val().keys.p256dh
                    }
                };

                webpush.sendNotification(pushConfig, JSON.stringify({
                    title: 'Refill needed',
                    content: 'Please check, ' + itemName + ' needs to be ordered',
                    openUrl: openNotifLandPage
                }))
                    .catch((err) => {
                        console.log(err);
                    })
            });
            response.status(201).json({ message: 'Data stored', id: request.body.id });
            return null;
        })
        .catch((err) => {
            console.log("error from webpush " + err);
        })

    console.log('Item Changed: ' + itemID + ' qty: ' + changeBefore + ' to ' + changeAfter);
});

exports.addAdminRole = functions.https.onCall((data, context) => {
    // Secure the cloud functions so code cannot be altered via developer tool
    if (context.auth.token.admin !== true) {
        return { error: "Only authorized user can add other admin!" };
    }

    // Get User and add cutom claims (admin)
    return admin.auth().getUserByEmail(data.email)
        .then(user => {
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            })
        })
        .then(() => {
            return {
                message: `Success! ${data.email} has been made an admin`
            }
        })
        .catch(err => {
            return err;
        });
});

// exports.toOrder = functions.database.ref('/AllStock/{Item_ID}').onUpdate((change, context) => {
//     const itemID = context.params.Item_ID;
//     const itemName = change.before.child('name').val();
//     const changeBefore = change.before.child('quantity').val();
//     const changeAfter = change.after.child('quantity').val();

//     console.log('Item Changed: ' + itemID + ' qty: ' + changeBefore + ' to ' + changeAfter);

//     if (changeAfter < 5) {
//         const payload = {
//             notification: {
//                 title: "Refill needed",
//                 body: itemName + ' is running out of stock'
//             }
//         }
//     }

//     userToken = localStorage.getItem('fcmToken');

//     console.log('FCM from local storage: ' + userToken);

//     return null;




//     // return admin.database().ref('/AllStock/' + itemID).once('value')
//     //     .then((snapShot) => {
//     //         var name = snapShot.child("name").val();
//     //         var category = snapShot.child("category").val();
//     //         var qty = snapShot.child("quantity").val();

//     //         messaging.usePublicVapidKey('BHTbhExI8YZcPROII-iGAhgQCJTBQZGpvLtizaj5gOfzGtYn1zXZm0lMPzAMszFGBNhnQUmSILm5Z6N3Ss1g0JY');

//     //         return console.log('name: ' + name + ' cat: ' + category + 'qty: ' + qty);
//     //     })
// })


