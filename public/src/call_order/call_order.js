var arrHead = new Array();
var url = "https://bubble-tastea-management.firebaseio.com/AllStock.json"
var networkDataReceived = false;
var listOrder = [];

arrHead = ['Name', 'Quantity', 'Action'];

// Create table structure (create table + headers)
function createTable(data) {
    var tableName = document.getElementById('table_call');
    var tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'tabBody');

    //add data to each row
    for (var i = 0; i < data.length; i++) {
        // add record to each row
        var tr = document.createElement('tr');

        if (data[i].category === 'Call') {
            //add record for each cell
            addCell(tr, 'a', data[i].name);
            addCell(tr, 'b', data[i].quantity);
            addCell(tr, 'c', data[i].id);

            //add the row with all its content to the tbody tag
            tbody.appendChild(tr);
            //add all element of the tbody into the table itself
            tableName.appendChild(tbody);

            tbody.addEventListener('click', myFunction);
        }
    }

    var parent;
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table');
    var z = t.length;

    // call makeSortable method to allow sorting on header click
    while (--z >= 0) makeSortable(t[z]);
}

var idNum = 1;

function addRow() {
    var tabName = document.getElementById('table_call');
    var tabBody = document.getElementById('tabBody');
    var tr = document.createElement('tr');
    tr.setAttribute('id', 'rowNo' + idNum);

    var itemName = document.createElement('input');
    itemName.setAttribute('type', 'text');

    addCell(tr, 'a', idNum);
    addCell(tr, 'b', idNum);
    addCell(tr, 'c', idNum);

    tabBody.appendChild(tr);

    var lastTr = tabBody.lastChild.id;
    console.log("last child = " + lastTr);

    tabName.appendChild(tabBody);

    idNum++;
}

function addCell(tr, cellPlace, val) {
    var td = document.createElement('td');
    if (cellPlace == 'a') {
        td.setAttribute('id', 'item-name');
        td.innerHTML = val;
    }
    else if (cellPlace == 'b') {
        td.setAttribute('id', 'item-quantity');
        td.innerHTML = val;
    }
    else if (cellPlace == 'd') {
        td.setAttribute('id', 'item-order');
        td.innerHTML = val;
    }
    else if (cellPlace == 'c') {
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

function addCellModal(tr, val) {
    var td = document.createElement('td');

    td.innerHTML = val;

    tr.appendChild(td)
}

// call this function once the tbody exist to any quantity cell in each row will be clickable
function myFunction(event) {
    var x = event.target;

    if (x.className == 'value-button') {
        var idEvt = x.id;
        // start letter is to know if we perform a decrease or an increase
        var start = idEvt[0];
        // num is to search for the id to which the increase/decrease operation will be performed
        // the last character in the number(n)/decrease(n)
        var num = idEvt.substring(idEvt.length - 4);
        var val = parseInt(document.getElementById('number' + num).value, 10);

        // is id-name start is 'i', we are increasng the current value
        if (start == 'i') {
            val = isNaN(val) ? 0 : val;
            val++;
            document.getElementById('number' + num).value = val;
        }
        // else, it starts with 'd' then we are decreasing the current value
        else {
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
                document.getElementById('number' + num).value = val;
            }
        }
    }
    else if (x.className == 'material-icons') {
        var currRow = x.id[x.id.length - 1];
        var table = document.getElementById('tabBody');
        var rows = table.getElementsByTagName('tr');

        x.closest('tr').remove();
    }
}

function increaseValue(x) {
    var value = parseInt(document.getElementById('number' + x).value, 10);
    value = parseInt(x, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number' + x).value = value;
}

function decreaseValue(x) {
    var value = parseInt(document.getElementById('number' + x).value, 10);
    var value = parseInt(x, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number' + x).value = value;
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

function placeOrder() {
    var table_body = document.getElementById('tabBody');
    var input_row = table_body.getElementsByTagName('input');
    var name_item, qty_item, to_order_item;
    var rowNb = input_row.length;
    var noOrder = 0;

    //Go through all the rows in the table and check if there is any order placed
    //for any given item
    for (var i = 0; i < rowNb; i++) {
        name_item = table_body.rows[i].cells[0].innerText;
        qty_item = table_body.rows[i].cells[1].innerText;
        to_order_item = input_row[i].value;

        //If the input box is not 0, then we should put this item in the array of 
        //item to buy
        if (to_order_item > 0 || (listOrder.findIndex((e) => e.name === name_item) !== -1)) {
            var obj = { name: name_item, quantity: to_order_item };
            //Before adding any element into the table, check if item as already been added
            //to the cart or not
            pushToArray(listOrder, obj);
        }
    }

    console.log("Length " + listOrder.length);

    if (document.contains(document.getElementById('tabBodyModal'))) {
        document.getElementById('tabBodyModal').remove();
    }
    if (document.contains(document.getElementById('divEmpty'))) {
        document.getElementById('divEmpty').remove();
        document.getElementById('place-order-btn').disabled = false;
        document.getElementById('place-order-btn').setAttribute('style', 'background-color: #9c27b0');
    }

    if (listOrder.length > 0) {
            var j;
            var tableNameModal = document.getElementById('table_modal');
            var tbodyModal = document.createElement('tbody');
            tbodyModal.setAttribute('id', 'tabBodyModal');

            //add data to each row
            for (j = 0; j < listOrder.length; j++) {

                // add record to each row
                var tr = document.createElement('tr');

                //add record for each cell
                addCellModal(tr, listOrder[j].name);
                addCellModal(tr, listOrder[j].quantity);
                addCellModal(tr, " ");

                //add the row with all its content to the tbody tag
                tbodyModal.appendChild(tr);
                //add all element of the tbody into the table itself
                tableNameModal.appendChild(tbodyModal);

                tbodyModal.addEventListener('click', myFunction);
            }
        //}
    }
    else {
        var divText = document.createElement('div');
        divText.setAttribute('id', 'divEmpty');
        var text = document.createTextNode("Order list is empty");
        var div = document.getElementById('modal-body-content');
        divText.appendChild(text);
        div.appendChild(divText);

        document.getElementById('place-order-btn').disabled = true;
        document.getElementById('place-order-btn').setAttribute('style', 'background-color: grey');
    }
}

function pushToArray(arr, obj) {
    var index = arr.findIndex((e) => e.name === obj.name);

    //If item has not already been added to the cart (listOrder array), add item to array
    if (index === -1) {
        arr.push(obj);
    }
    //Else if item already exists, only change its qty
    else {       
        //if the item was already added to the cart but then its value has been reset to 0
        //remove it from the array  
        if (obj.quantity == 0) {
            for (var z = 0; z < arr.length; z++) {
                if (arr[z].name === obj.name) {
                    arr.splice(z, 1);
                    z--;
                }
            }
        }
        //else if the value has only been modified, just replace the old with the new
        else {
            arr[index] = obj;
        }
    }
}

fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        networkDataReceived = true;
        console.log('From web', data);
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
                console.log('From cache', data);
                if (document.getElementById('table_call') != 'undefined' && document.getElementById('table_call') != null) {
                }
                else {
                    createTable(data);
                }
            }
        });
}