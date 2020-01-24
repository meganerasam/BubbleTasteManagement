var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./bubble-tastea-fb-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bubble-tastea-management.firebaseio.com/'
})

exports.storeOrderTaiwan = functions.https.onRequest(function (request, response) {
    cors(request, response, function () {
        var id_item = request.body.name + " (" + request.body.id + ")";
        admin.database().ref('Taiwan').push({
            id: request.body.id,
            name: request.body.name,
            category: request.body.category,
            order: request.body.to_order,
            id_item: request.body.id_item
        })
            .then(function () {
                //Add push notification to every subscribed client 
                //when Taiwa order is updated
                webpush.setVapidDetails('mailto:meganerasam@yahoo.fr',
                    'BCur9hz52C3vbSZkJgEUowh-XD5D88HsCVcaFNac4atc1UwQjzUoIwLUPCZhlpxJqXaF8EM5q6ZzRPvq5-pzqTg',
                    'TR2fkUd8AfJw6SVXxB8nHYBEkDnzG4MBWNP4-5xiVdo');

                //Send the push notif to all subscribed user by looping through
                //the BD
                return admin.database().ref('subscriptions').once('value');
            })
            .then(function (subscriptions) {
                subscriptions.forEach(function (sub) {
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
                        .catch(function (err) {
                            console.log(err);
                        })
                });
                response.status(201).json({ message: 'Data stored', id: request.body.id });
                return null;
            })
            .catch(function (err) {
                response.json({ error: err });
            })
    })
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

exports.disableUser = functions.https.onCall((data, context) => {
    console.log('disableUser')
    // Secure the cloud functions so code cannot be altered via developer tool

    if (context.auth.token.admin !== true) {
        return { error: "Only authorized user can disable user account!" };
    }

    return admin.auth().getUserByEmail(data.email)
        .then(user => {
            return admin.auth().updateUser(user.uid, {
                password: "Qwertyuiop",
                disabled: true
            })
        })
        .then(() => {
            return{
                message: `Success! ${data.email} account has been deactivated`
            }
        })
        .catch (err => {
            return console.log(err.message);
        });


    // return admin.auth().getUserByEmail(data.email)
    //     .then(user => {
    //         return admin.auth().setCustomUserClaims(user.uid, {
    //             admin: null
    //         })
    //     })
    //     .then(() => {
    //         return{
    //             message: `Success! ${data.email} is not an admin anymore`
    //         }
    //     })
    //     .catch (err => {
    //         return console.log(err.message);
    //     });
});


