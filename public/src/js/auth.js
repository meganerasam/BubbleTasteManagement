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
                user.admin = idTokenResult.claims.admin;
                setupUI(user);
                setupHomePage(user);
            })
    }
    else {
        console.log('User status: logged out');
    }
});

const signupform = document.getElementById('signup-form');

// SIGN UP
function signupUser() {
    event.preventDefault();

    console.log('sigup function clicked');

    //Get user info (email and password)
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-pass').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            event.preventDefault();
            console.log(cred);
            const modal = document.getElementById('modal-signup');
            $('#modal-signup').modal('hide');
            signupform.reset();
        });
}


// $('#signup-form').on('submit', (event) => {
//     //Prevent default of refreshing page and losing data on click
//     event.preventDefault();

//     console.log('user signed in');
//     //Get user info (email and password)
//     // var email = signupform['signup-email'].value;
//     // var password = signupform['signup-pass'].value;

//     // //Sign up the user
//     // auth.createUserWithEmailAndPassword(email, password)
//     //     .then(cred => {
//     //         event.preventDefault();
//     //         console.log(cred);
//     //         const modal = document.getElementById('modal-signup');
//     //         //$('#modal-signup').modal('hide');
//     //         signupform.reset();
//     //     });
// });


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

// MAKE AND ADMIN
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




