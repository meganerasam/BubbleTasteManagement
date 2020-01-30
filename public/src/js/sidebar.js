var divSidebar = document.getElementById('load-sidebar');
var contentSidebar = document.getElementById('mySidebar');
var list = document.getElementById('nav-list');

var userMenu = document.getElementsByClassName('logged-in');
var adminMenu = document.getElementsByClassName('admin');

const setupUI = (user => {
    if (user) {
        if (user.admin) {
            for (var i = 0; i < userMenu.length; i++) {
                userMenu[i].style.display = 'block';
            }
            for (var i = 0; i < adminMenu.length; i++) {
                adminMenu[i].style.display = 'block';
            }
        }
        else {
            for (var i = 0; i < userMenu.length; i++) {
                userMenu[i].style.display = 'block';
            }
            for (var i = 0; i < adminMenu.length; i++) {
                adminMenu[i].style.display = 'none';
            }
        }
    }
    else {
        console.log('back to login');
        window.location = '/login.html';
    }
});

const checkLog = (user => {
    if (user.uid) {
            console.log('sidebar.js ' + user.uid);
    }
    else {
        window.location = '/login.html';
    }
})

// function navClick() {
//     $('ul.nav li').click(function (event) {
//         event.preventDefault();
//         var id = $(this).attr('id');
//         console.log(id);

//         if (id === 'logout-link') {
//             console.log('logout clicked ');
//         }
//     })
// };

// function openNav() {
//     contentSidebar.style.width = "250px";
//     console.log("open nav");
//     //navClick();
// };

// function closeNav() {
//     contentSidebar.style.width = "0";
// };


