var url = "https://bubble-tastea-management.firebaseio.com/AllStock.json"
var networkDataReceived = false;

var dataObj = new Array();

function createTable(data) {

    var table = $('#table_pas').DataTable({
        columns: [
            { title: "Name" },
            { title: "Cat" },
            { title: "Qty" }
        ]
    });

    for (var i = 0; i < data.length; i++) {
        var obj = JSON.stringify({
            name: data[i].name,
            category: data[i].category,
            quantity: data[i].quantity
        })
        dataObj.push(obj);
    }

    for (var j = 0; j < dataObj.length; j++) {
        var json = JSON.parse(dataObj[j]);

        if ((json.category !== 'Call') && (json.category !== 'Intermart')){
            table.row.add([
                json.name,
                json.category,
                json.quantity
            ]).draw();
        }
    }
}

fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        networkDataReceived = true;
        //console.log('From web', data);
        var dataArray = [];
        for (key in data) {
            dataArray.push(data[key]);
        }
        createTable(dataArray);
    });

if ('indexedDB' in window) {
    readAllData('pas')
        .then(function (data) {
            console.log("readAllData from spas.js (indexedDB)");
            if (!networkDataReceived) {
                //console.log('From cache', data);
                if (document.getElementById('table_pas') != 'undefined' && document.getElementById('table_pas') != null) {
                }
                else {
                    createTable(data);
                }
            }
        });
}
