var arrHead = new Array();
var url = "https://bubble-tastea-management.firebaseio.com/Item.json"
var networkDataReceived = false;

arrHead = ['Name', 'Category', 'Quantity'];

// Create table structure (create table + headers)
function createTable(data) {
    var empTable = document.createElement('table');
    empTable.setAttribute('class', 'table');// SET THE TABLE CLASS.
    empTable.setAttribute('id', 'table_pas');

    var header = empTable.createTHead();
    var tr = header.insertRow(-1);

    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th');// TABLE HEADER.       
        th.innerHTML = arrHead[h];

        tr.appendChild(th);
    }

    var div = document.getElementById('pointes_aux_sables_table');
    div.appendChild(empTable);// ADD THE TABLE TO YOUR WEB PAGE.

    var tableName = document.getElementById('table_pas');
    var tbody = document.createElement('tbody');

    //add data to each row
    for (var i = 0; i < data.length; i++) {
        // add record to each row
        var tr = document.createElement('tr');

        //add record for each cell
        addCell(tr, data[i].name);
        addCell(tr, data[i].category);
        addCell(tr, data[i].quantity);

        //add the row with all its content to the tbody tag
        tbody.appendChild(tr);
        //add all element of the tbody into the table itself
        tableName.appendChild(tbody);
    }

    var parent;
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table');
    var z = t.length;

    // call makeSortable method to allow sorting on header click
    while (--z >= 0) makeSortable(t[z]);
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
                if (document.getElementById('table_pas') != 'undefined' && document.getElementById('table_pas') != null){            
                }
                else{
                    createTable(data);
                }
            }
        });
}

// if ('caches' in window) {
//     caches.match(url)
//         .then(function (response) {
//             if (response) {
//                 return response.json();
//             }
//         })
//         .then(function (data) {
//             console.log('From cache', data);
//             if (!networkDataReceived) {
//                 for (key in data) {
//                     dataArray.push(data[key]);
//                 }
//                 createTable(dataArray);
//             }
//         });
// }