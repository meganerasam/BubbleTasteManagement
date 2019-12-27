var arrHead = new Array();
var url = "https://bubble-tastea-management.firebaseio.com/AllStock.json"
var networkDataReceived = false;


arrHead = ['Name', 'Category', 'Quantity'];

var dataObj = new Array();

// Create table structure (create table + headers)
function createTable(data) {

    var table = $('#myTable').DataTable({
        columns: [
            { title: "Name" },
            { title: "Category" },
            { title: "Quantity" }
        ]
    });

    for (var i = 0; i < data.length; i++) {
        var obj = JSON.stringify({
            name: data[i].name,
            category: data[i].category,
            quantity: data[i].quantity
        })

        //console.log("dataObj length " + JSON.stringify(obj));
        dataObj.push(obj);
    }

    console.log("dataObj length " + dataObj[0]);

    console.log('leng ' + dataObj[1].name);
    for (var j = 0; j < dataObj.length; j++) {
        var json = JSON.parse(dataObj[j]);

        console.log("json name " + json.name);

        if ((json.category !== 'Call') && (json.category !== 'Intermart')){
            table.row.add([
                json.name,
                json.category,
                json.quantity
            ]).draw();
        }
    }






    // var tableName = document.getElementById('myTable');
    // var tbody = document.getElementsById('tableBody');

    // //add data to each row
    // for (var i = 0; i < data.length; i++) {
    //     // add record to each row
    //     var tr = document.createElement('tr');

    //     if ((data[i].category !== 'Call') && (data[i].category !== 'Intermart')) {
    //         //add record for each cell
    //         addCell(tr, data[i].name);
    //         addCell(tr, data[i].category);
    //         addCell(tr, data[i].quantity);

    //         //add the row with all its content to the tbody tag
    //         tbody.appendChild(tr);
    //         //add all element of the tbody into the table itself
    //         //tableName.appendChild(tbody);
    //     }
    // }

    // var parent;
    // parent = parent || document.body;
    // var t = parent.getElementsByTagName('table');
    // var z = t.length;

    // // call makeSortable method to allow sorting on header click
    // //while (--z >= 0) makeSortable(t[z]);

}

function makeSortable(table) {
    var th = table.tHead, i;
    th && (th = th.rows[0]) && (th = th.cells);
    if (th) i = th.length;
    else return; // if no `<thead>` then do nothing
    while (--i >= 0) (function (i) {
        var dir = 1;
        dir = 1 - dir;
        th[i].addEventListener('click', function () {
            console.log("addclicklistener");

            var tb = table.tBodies[0], // use `<tbody>` to ignore `<thead>` and `<tfoot>` rows
                tr = Array.prototype.slice.call(tb.rows, 0), // put rows into array
                u;
            dir = -((+dir) || -1);
            tr = tr.sort(function (a, b) { // sort rows
                return dir // `-1 *` if want opposite order
                    * (a.cells[i].textContent.trim() // using `.textContent.trim()` for test
                        .localeCompare(b.cells[i].textContent.trim())
                    );
            });
            for (u = 0; u < tr.length; ++u) tb.appendChild(tr[u]); // append each row in order
        });
    }(i));


}

function addCell(tr, val) {
    var td = document.createElement('td');

    td.innerHTML = val;

    tr.appendChild(td)
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
                if (document.getElementById('myTable') != 'undefined' && document.getElementById('myTable') != null) {
                }
                else {
                    createTable(data);
                }
            }
        });
}
