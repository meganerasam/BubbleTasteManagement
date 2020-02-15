var emailVerifiedContent = document.getElementById('content_verified');
var emailNotVerifiedContent = document.getElementById('content_not_verified');


const setupHomePage = (user => {
    if (user) {
        //var email_verified = user.email_verified;      
         
        if (user.emailVerified) {
            console.log("HomeSetUp : " + user.emailVerified); 
            emailVerifiedContent.style.display = 'block';
            emailNotVerifiedContent.style.display = 'none';
        }
        else {
            emailVerifiedContent.style.display = 'none';
            emailNotVerifiedContent.style.display = 'block';
        }
    }
});