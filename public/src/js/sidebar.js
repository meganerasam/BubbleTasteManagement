
var divSidebar = document.getElementById('load-sidebar');
var contentSidebar = document.getElementById('mySidebar');
var list = document.getElementById('nav-list');

function navClick() {
    $('ul.nav li').click(function (event) {
        event.preventDefault();
        var id = $(this).attr('id');
        console.log(id);

        if (id === 'logout-link') {
            console.log('logout clicked ');

            // auth.signOut()
            //     .then(() => {


            //         console.log("User logged out ");
            //     });
        }
    })
};

function openNav() {
    contentSidebar.style.width = "250px";
    console.log("open nav");
    //navClick();
};

function closeNav() {
    contentSidebar.style.width = "0";
};


