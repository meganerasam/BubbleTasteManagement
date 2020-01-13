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

// Make auth references
var auth = firebase.auth();

//LISTEN TO AUTH STATE CHANGES
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User status: logged in');
    }
    else {
        console.log('User status: logged out');
    }
});


// SIGN UP
const signupform = document.getElementById('signup-form');

$('#signup-form').on('submit', (event) => {
    //Prevent default of refreshing page and losing data on click
    event.preventDefault();

    //Get user info (email and password)
    var email = signupform['signup-email'].value;
    var password = signupform['signup-pass'].value;

    //Sign up the user
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => {
            console.log(cred);
            const modal = document.getElementById('modal-signup');
            $('#modal-signup').modal('hide');
            signupform.reset();

            
        });
});


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
        });
});

//LOG OUT
function authLogout(){
        event.preventDefault();
    
        console.log('from auth.js');
    
        //Log out the user
        auth.signOut()
            .then(() => {
    
                window.location = "/login.html";
            });
    
}




