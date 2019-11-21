var refillButton = document.getElementById('refill-button');

function goToRefill(){
    //do something here to view current stock list
    console.log('Go To Refill Clicked');
    if (deferredPrompt){
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function(choiceResult){
            console.log(choiceResult.outcome);

            if(choiceResult.outcome === 'dismissed'){
                console.log('[REFILL] .... User Cancelled Installation');
            }else{
                console.log('[REFILL] .... User added to homescreen');
            }          
        });

        deferredPrompt = null;
    }
};

refillButton.addEventListener('click', goToRefill);