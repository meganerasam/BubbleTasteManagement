var viewStockButton = document.getElementById('stock-button');

function goToStockList(){
    //do something here to view current stock list
    console.log('Go To Stock Clicked');
    if (deferredPrompt){
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function(choiceResult){
            console.log(choiceResult.outcome);

            if(choiceResult.outcome === 'dismissed'){
                console.log('User Cancelled Installation');
            }else{
                console.log('User added to homescreen');
            }          
        });

        //deferredPrompt = null;
    }
};

viewStockButton.addEventListener('click', goToStockList);