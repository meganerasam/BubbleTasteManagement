var menuAdmin = document.getElementsByClassName('admin');

const setupHomePage = (user => {
    if (user) {
        if (user.admin) {
            for (var i = 0; i < menuAdmin.length; i++) {
                adminMenu[i].style.display = 'block';
            }
        }
        else {
            for (var i = 0; i < menuAdmin.length; i++) {
                adminMenu[i].style.display = 'none';
            }
        }
    }
    else{
        window.location = '/login.html';
    }
})