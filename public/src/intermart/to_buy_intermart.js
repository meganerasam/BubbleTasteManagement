var arrHead = new Array();

// var url = "https://bubble-tastea-management.firebaseio.com/Item.json"
// var networkDataReceived = false;

arrHead = ['Name', 'Quantity', 'Action'];

// Create table structure (create table + headers)
function createTable() {

    if ($('table#table_intermart').length) {
        alert('exists');
    }
    else {
        var empTable = document.createElement('table');
        empTable.setAttribute('class', 'table');// SET THE TABLE CLASS.
        empTable.setAttribute('id', 'table_intermart');

        var theader = empTable.createTHead();
        var tbody = empTable.createTBody();
        tbody.setAttribute('id', 'tabBody');

        var tr = theader.insertRow(-1);

        for (var h = 0; h < arrHead.length; h++) {
            var th = document.createElement('th');// TABLE HEADER.       
            th.innerHTML = arrHead[h];

            tr.appendChild(th);
        }

        var div = document.getElementById('intermart_table');
        div.appendChild(empTable);// ADD THE TABLE TO YOUR WEB PAGE.

        var tableName = document.getElementById('table_intermart');
        tableName.appendChild(tbody);

        console.log("no tr in tbody = " + $('#tabBody tr').length);


        // //add data to each row
        // for (var i = 0; i < data.length; i++) {
        //     // add record to each row
        //     var tr = document.createElement('tr');

        //     //add record for each cell
        //     addCell(tr, data[i].name);
        //     addCell(tr, data[i].category);
        //     addCell(tr, data[i].quantity);

        //     //add the row with all its content to the tbody tag
        //     tbody.appendChild(tr);
        //     //add all element of the tbody into the table itself
        //     tableName.appendChild(tbody);
        // }

        // var parent;
        // parent = parent || document.body;
        // var t = parent.getElementsByTagName('table');
        // var z = t.length;

        // // call makeSortable method to allow sorting on header click
        // while (--z >= 0) makeSortable(t[z]);

        tbody.addEventListener('click', myFunction);
    }
}

var idNum = 1;

function addRow() {
    var tabName = document.getElementById('table_intermart');
    var tabBody = document.getElementById('tabBody');
    var tr = document.createElement('tr');
    tr.setAttribute('id', 'rowNo' + idNum);

    //var countRow = tabName.getElementsByTagName('tr').length;
    //console.log("countRow = " + countRow);
    console.log("countRow = " + idNum);

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

function addCell(tr, val, row) {
    var tabName = document.getElementById('table_intermart');
    var tabBody = document.getElementById('tabBody');
    var td = document.createElement('td');

    if (val == 'a') {
        var div = document.createElement('div');
        div.setAttribute('class', 'form-group');
        var itemName = document.createElement('input');
        itemName.setAttribute('type', 'text');
        itemName.setAttribute('id', 'input_item_name' + row);
        itemName.setAttribute('placeholder', 'Item Name ...');

        div.appendChild(itemName);
        td.appendChild(div);
    }
    else if (val == 'b') {
        var form = document.createElement('form');

        var divDecr = document.createElement('div');
        divDecr.setAttribute('class', 'value-button');
        divDecr.setAttribute('id', 'decrease' + row);
        divDecr.innerHTML = '-';

        // var divDecr = document.createElement('button');
        // divDecr.setAttribute('class', 'value-button');
        // divDecr.setAttribute('id', 'decrease' + row);
        // divDecr.innerHTML = '-';

        form.appendChild(divDecr);

        //console.log("qty = " + qty.value);

        var qty = document.createElement('input');
        qty.setAttribute('type', 'number');
        qty.setAttribute('id', 'number' + row);
        qty.setAttribute('value', 0);
        form.appendChild(qty);

        var divIncr = document.createElement('div');
        divIncr.setAttribute('class', 'value-button');
        divIncr.setAttribute('id', 'increase' + row);
        divIncr.innerHTML = '+';
        //divIncr.addEventListener('click', increaseValue(row));

        // var divIncr = document.createElement('button');
        // divIncr.setAttribute('class', 'value-button');
        // divIncr.setAttribute('id', 'increase' + row);
        // divIncr.innerHTML = '+';
        //divIncr.addEventListener('click', increaseValue(row, qty.value));

        form.appendChild(divIncr);

        td.appendChild(form);

        // var div = document.createElement('div');

        // var buttonD = document.createElement('button');
        // buttonD.setAttribute('class', 'value-button-d');
        // buttonD.setAttribute('id', 'decrease_button' + row);
        // div.appendChild(buttonD);

        // var qty = document.createElement('input');
        // qty.setAttribute('type', 'number');
        // qty.setAttribute('id', 'number' + row);
        // qty.setAttribute('value', 0);
        // div.appendChild(qty);

        // var buttonI = document.createElement('button');
        // buttonI.setAttribute('class', 'value-button-i');
        // buttonI.setAttribute('id', 'increase_button' + row);
        // div.appendChild(buttonI);

        // td.appendChild(div);
    }
    else {
        var div = document.createElement('div');
        div.setAttribute('id', 'div_btn_del');
        var delAction = document.createElement('button');
        delAction.setAttribute('class', 'btn btn-del');

        var i = document.createElement('i');
        i.setAttribute('class', 'material-icons');
        i.setAttribute('id', 'del_button' + row);
        i.innerHTML = "clear";
        delAction.appendChild(i);

        div.appendChild(delAction);
        td.appendChild(div);

        //td.innerHTML = val;
    }

    tr.appendChild(td);
    tabBody.appendChild(tr);
    tabName.appendChild(tabBody);

}

// call this function once the tbody exist to any quantity cell in each row will be clickable
function myFunction(event) {
    var x = event.target;
    console.log("current element clicked = " + x.id);

    if (x.className == 'value-button') {
        //console.log("clicked a value-button class");
        var idEvt = x.id;
        // start letter is to know if we perform a decrease or an increase
        var start = idEvt[0];
        // num is to search for the id to which the increase/decrease operation will be performed
        // the last character in the number(n)/decrease(n)
        var num = idEvt[idEvt.length - 1];
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
    else if (x.className == 'material-icons') {
        //document.getElementById("demo").innerHTML = "NOT CLASSNAME";
        //console.log(x.id);
        var currRow = x.id[x.id.length - 1];
        var table = document.getElementById('tabBody');
        var rows = table.getElementsByTagName('tr');

        // console.log("before = " + rows.length);
        // console.log("to be deleted = " + currRow);

        x.closest('tr').remove();
    }
}

function increaseValue(x) {
    var value = parseInt(document.getElementById('number' + x).value, 10);
    value = parseInt(x, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number' + x).value = value;
    // var qty = document.getElementById('number' + x);
    // val = isNaN(val) ? 0 : val;
    // val++;
    // //document.getElementById('number' + x).value = val;
    // qty.innerHTML = val;

    console.log("increase = " + x + "val = " + value);
}

function decreaseValue(x) {
    var value = parseInt(document.getElementById('number' + x).value, 10);
    var value = parseInt(x, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number' + x).value = value;

    // var element = document.getElementById('number' + x);
    // var currQty = element.value;

    // console.log(currQty);
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


// fetch(url)
//     .then(function (res) {
//         return res.json();
//     })
//     .then(function (data) {
//         networkDataReceived = true;
//         console.log('From web', data);
//         var dataArray = [];
//         for (key in data) {
//             dataArray.push(data[key]);
//         }
//         createTable(dataArray);
//     });

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