var table = document.querySelector('table');

var arrHead = new Array();
var url = "https://bubble-tastea-management.firebaseio.com/Item.json"
var networkDataReceived = false;

arrHead = ['Name', 'Cat.', 'Stock', 'To Order'];

// Create table structure (create table + headers)
function createTable(data) {
    var empTable = document.createElement('table');
    empTable.setAttribute('class', 'table');// SET THE TABLE CLASS.
    empTable.setAttribute('id', 'table_taiwan');

    var header = empTable.createTHead();
    var tr = header.insertRow(-1);

    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th');// TABLE HEADER.
        th.innerHTML = arrHead[h];

        tr.appendChild(th);
    }

    var div = document.getElementById('taiwan_table');
    div.appendChild(empTable);// ADD THE TABLE TO YOUR WEB PAGE.

    var tableName = document.getElementById('table_taiwan');
    var tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'tabBody');

    //add data to each row
    for (var i = 0; i < data.length; i++) {
        // add record to each row
        var tr = document.createElement('tr');

        //add record for each cell
        addCell(tr, 'a', data[i].name);
        addCell(tr, 'b', data[i].category);
        addCell(tr, 'c', data[i].quantity);
        addCell(tr, 'd', data[i].id);

        // addCell(tr, 'a', data[i]);
        // addCell(tr, 'b', data[i]);
        // addCell(tr, 'c', data[i]);
        // addCell(tr, 'd', data[i]);

        //add the row with all its content to the tbody tag
        tbody.appendChild(tr);
        //add all element of the tbody into the table itself
        tableName.appendChild(tbody);

        tbody.addEventListener('click', myFunction);
    }

    var parent;
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table');
    var z = t.length;

    // call makeSortable method to allow sorting on header click
    while (--z >= 0) makeSortable(t[z]);
}

// call this function once the tbody exist to any quantity cell in each row will be clickable
function myFunction(event) {
    var x = event.target;
    // console.log("current element clicked = " + x.id);

    if (x.className == 'value-button') {
        //console.log("clicked a value-button class");
        var idEvt = x.id;
        // start letter is to know if we perform a decrease or an increase
        var start = idEvt[0];
        // num is to search for the id to which the increase/decrease operation will be performed
        // the last character in the number(n)/decrease(n)
        // var num = idEvt[idEvt.length - 1];
        var num = idEvt.substring(idEvt.length - 4);
        var val = parseInt(document.getElementById('number' + num).value, 10);

        console.log("id = " + x.id + " last digit = " + num + " start = " + start);

        // is id-name start is 'i', we are increasng the current value
        if (start == 'i') {
            //console.log("val before = " + val);
            val = isNaN(val) ? 0 : val;
            val++;
            //console.log("val after = " + val);
            document.getElementById('number' + num).value = val;
        }
        // else, it starts with 'd' then we are decreasing the current value
        else {
            console.log("val before = " + val);
            val = isNaN(val) ? 0 : val;
            val < 1 ? value = 1 : '';
            // check if current value is equal to 0
            // if so, the value shall remain 0 as it cannot be negative
            if (val == 0) {
                document.getElementById('number' + num).value = val;
            }
            // else, decrease the current value by 1
            else {
                val--;
                //console.log("val after = " + val);
                document.getElementById('number' + num).value = val;
            }
        }
    }
    // else if (x.className == 'btn btn-save') {
    //     //document.getElementById("demo").innerHTML = "NOT CLASSNAME";
    //     //console.log(x.id);
    //     var table = document.getElementsByTagName(tbody);
    //     var rowNb = table.length;

    //     console.log("nb of row in body = " + rowNb);

    //     // console.log("before = " + rows.length);
    //     // console.log("to be deleted = " + currRow);

    //     //x.closest('tr').remove();
    // }
}

function saveOrder() {
    var table_body = document.getElementById('tabBody');
    var input_row = table_body.getElementsByTagName('input');
    var name_item, cat_item, qty_item, to_order_item;
    var rowNb = input_row.length;
    var noOrder = 0;
    var withOrder = 0;

    for (var i = 0; i < rowNb; i++) {
        name_item = table_body.rows[i].cells[0].innerText;
        cat_item = table_body.rows[i].cells[1].innerText;
        qty_item = table_body.rows[i].cells[2].innerText;
        to_order_item = input_row[i].value;
        id_item = (input_row[i].id).substring(input_row[i].id.length - 4);

        //console.log("id " + id_item);

        if (to_order_item == 0) {
            noOrder++;
        }
        else {
            withOrder++;
            console.log(name_item);
            syncData(name_item, cat_item, to_order_item, id_item);
        }
    }

    if (noOrder == rowNb) {
        alert('Please enter order');
    }
    else {
        // if ('serviceWorker' in navigator && 'SyncManager' in window){
        //     navigator.serviceWorker.ready
        //         .then (function(sw){

        //             var item = {
        //                 id: new Date().toISOString(),
        //                 name:
        //             }

        //             sw.sync.register('sync-taiwan-order');
        //         });
        // }
    }
}

function syncData(item_name, item_cat, item_to_order, item_id) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
            .then(function (sw) {
                var item = {
                    id: item_id + "-" + new Date().toISOString(),
                    name: item_name,
                    category: item_cat,
                    to_order: item_to_order,
                    id_i: item_id
                };

                writeData('sync-order', item)
                    .then(function () {
                        return sw.sync.register('sync-taiwan-order');
                    })
                    .catch(function (err) {
                        console.log(err);
                    })

            });
        console.log("id " + item_id);
    }
    else {
        sendData();
    }
}

function sendData() {
    var today = new Date();
    var date = (today.getMonth() + 1) + "/" + today.getFullYear();
    var title = name_item + " (" + id_item + ")";
    var idi = id_item + (today.getMonth() + 1) + "/" + today.getFullYear();
    fetch('https://us-central1-bubble-tastea-management.cloudfunctions.net/storeOrderTaiwan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            id: id_item + "-" + new Date().toISOString(),
            name: name_item,
            category: cat_item,
            to_order: to_order_item,
            id_i: id_item
        })
        // body: JSON.stringify({
        //     [title]: {
        //         id: idi,
        //         name: name_item,
        //         category: cat_item,
        //         to_order: to_order_item,
        //         id_item: id_item,
        //         date_order: date
        //     }
        // })
    })
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

function addCell(tr, cellPlace, val) {
    var td = document.createElement('td');

    // if (cellPlace == 'a' || cellPlace == 'b' || cellPlace == 'c') {
    //     td.innerHTML = val;
    // }
    if (cellPlace == 'a') {
        td.setAttribute('id', 'item-name');
        td.innerHTML = val;
    }
    else if (cellPlace == 'b') {
        td.setAttribute('id', 'item-category');
        td.innerHTML = val;
    }
    else if (cellPlace == 'c') {
        td.setAttribute('id', 'item-quantity');
        td.innerHTML = val;
    }
    else if (cellPlace == 'd') {
        var div = document.createElement('div');
        div.setAttribute('style', 'min-width:90px');
        var form = document.createElement('form');

        var divDecr = document.createElement('div');
        divDecr.setAttribute('class', 'value-button');
        divDecr.setAttribute('id', 'decrease' + val);
        divDecr.innerHTML = '-';

        form.appendChild(divDecr);

        var qty = document.createElement('input');
        qty.setAttribute('type', 'number');
        qty.setAttribute('id', 'number' + val);
        qty.setAttribute('value', 0);
        form.appendChild(qty);

        var divIncr = document.createElement('div');
        divIncr.setAttribute('class', 'value-button');
        divIncr.setAttribute('id', 'increase' + val);
        divIncr.innerHTML = '+';

        form.appendChild(divIncr);
        div.appendChild(form);
        td.appendChild(div);
    }

    tr.appendChild(td)
}

// table.addEventListener('submit', function(event){
//     event.preventDefault();

//     var table_body = document.getElementById('tabBody');
//     var input_row = table_body.getElementsByTagName('input');
//     var rowNb = input_row.length;
//     var noOrder = 0;
//     var withOrder = 0;

//     for (var i = 0; i < rowNb; i++) {
//         if (input_row[i].value = 0){
//             noOrder++;
//         }
//         else {
//             console.log("inputID = " + input_row[i].id + " inputVal = " + input_row[i].value);
//             withOrder++;
//         }
//     }

//     if (noOrder = rowNb){
//         alert('order cannot be empty');
//     }
//     else {
//         alert('nb item to order = ' + withOrder);
//     }
// })

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
        //console.log("table from fetch");
        createTable(dataArray);

    });

if ('indexedDB' in window) {
    readAllData('pas')
        .then(function (data) {
            if (!networkDataReceived) {
                console.log('From cache', data);
                console.log("table from indexedDB");
                console.log(document.getElementById('table_taiwan'));
                if (document.getElementById('table_taiwan') == 'undefined' || document.getElementById('table_taiwan') == null) {
                    createTable(data);
                }
                else {

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