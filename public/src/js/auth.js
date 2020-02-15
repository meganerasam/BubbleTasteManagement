// Your web app's Firebase configuration
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

// Make auth and firestore references
var auth = firebase.auth();
var dbFirestore = firebase.firestore();

//LISTEN TO AUTH STATE CHANGES
auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult()
            .then(idTokenResult => {
                console.log('user role: ' + idTokenResult.claims.admin);
                user.admin = idTokenResult.claims.admin;
                setupUI(user);
                setupHomePage(user);
            });

        var email_verified = user.emailVerified;

        console.log("Is User verified ? " + email_verified);
    }
    else if (window.location.href == 'http://127.0.0.1:8005/forgot_password.html'){
        console.log('forgot password page');
    }
    else {
        if (window.location.href == 'http://127.0.0.1:8005/login.html') {
            console.log('please log in');
        }
        else {
            window.location = '/login.html';
        }
    }

});

// GET CURENT USER INFO
function currentUserInfo() {
    var nowUser = auth.currentUser;
    console.log('is signed in ? ' + nowUser);
}

const signupform = document.getElementById('signup-form');

// SIGN UP
function signupUser() {
    event.preventDefault();

    console.log('sigup function clicked');

    //Get user info (email and password)
    var email = document.getElementById('new-user-email').value;
    var password = document.getElementById('new-user-pass').value;

    var name = document.getElementById('new-user-name').value;
    var phone = document.getElementById('new-user-phone').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            return dbFirestore.collection('users').doc(cred.user.uid).set({
                name: name,
                phone: phone,
                email: email
            });
        }).then(() => {
            console.log(cred);
        });
}

// SEND EMAIL CONFIRMATION LINK
function emailConfirmation() {
    var user = auth.currentUser;

    user.sendEmailVerification().then(function () {
        // Email sent.
        window.alert('Verification link sent');
        window.location = '/login.html';
    }).catch(function (error) {
        // An error happened.
    });
}


// LOGIN
const loginform = document.getElementById('login-form');

$('#login-form').on('submit', (event) => {
    //Prevent default of refreshing page and losing data on click
    event.preventDefault();

    //Get user info (email and password)
    var email = loginform['login-email'].value;
    var password = loginform['login-pass'].value;

    //Login the user
    auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            console.log(cred.user);
            loginform.reset();

            window.location = "/index.html";
        })
        .catch((err) => {
            var errorDisplay = document.getElementById('error-message');
            errorDisplay.innerHTML = err.message;
        })
});

//LOG OUT
function authLogout() {
    event.preventDefault();

    console.log('from auth.js');

    //Log out the user
    auth.signOut()
        .then(() => {

            window.location = "/login.html";
        });

}

// MAKE AN ADMIN
function authMakeAdmin() {
    event.preventDefault();

    console.log('auth.js make an admin function');

    var toBeAdminEmail = document.getElementById('make-admin-email').value;
    var addAdminRole = fun.httpsCallable('addAdminRole');
    addAdminRole({
        email: toBeAdminEmail
    })
        .then(result => {
            console.log('make-admin.js ', result);
        });
}

// REMOVE ADMIN PRVIVILEGE
function authDeactivateUser() {
    event.preventDefault();

    var toBeRemovedEmail = document.getElementById('remove-admin-email').value;
    var disableUser = fun.httpsCallable('disableUser');

    disableUser({
        email: toBeRemovedEmail
    })
        .then(result => {
            console.log('remove-admin.js ', result);
        });
}

// RESET PASSWORD
const forgotpassform = document.getElementById('forgot-pass-form');

$('#forgot-pass-form').on('submit', (event) => {
    //Prevent default of refreshing page and losing data on click
    event.preventDefault();

    //Get user info (email and password)
    var email = forgotpassform['forgot-pass-email'].value;

    if (email != "") {
        auth.sendPasswordResetEmail(email)
            .then(function () {
                console.log(email);
                window.alert('An email has been sent to you, please check and follow the instruction');
                window.location = '/login.html';
            })
            .catch((err) => {
                var errorDisplay = document.getElementById('error-message-forgot-pass');
                errorDisplay.innerHTML = err.message;
            })
    }
    else {
        window.alert('Please enter an email first');       
    }
});




