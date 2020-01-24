var listUserTable = document.getElementsById('make_admin_table_body');

const setupListUser = ((data) => {
    console.log('setupListUser ' + data.length);
    if (data.length) {
        var html = '';
        data.forEach(doc => {
            const staff = doc.data();
            const tr = `
                <tr>
                    <td>${staff.name}</td>
                    <td>${staff.email}</td>
                    <td><input type='checkbox' name ='check_${staff.uid}'/></td>
                </tr>            
            `;
            html += tr;
        });

        listUserTable.appendChild(tr);
    }
});