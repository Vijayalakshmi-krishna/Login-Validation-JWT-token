//welcome the user
var email = localStorage.getItem("email");
window.onload = document.getElementById("h1").innerHTML = "welcome " + email;
window.onload = document.getElementById("editPopup").style.display = "none";

//insert the products
async function insert() {
    var data = {
        email: localStorage.getItem("email"),
        product: document.getElementById("essentials").value,
        quantity: document.getElementById("quantity").value
    };
    var resData = await fetch("http://localhost:3000/insert", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"

        },
        body: JSON.stringify(data)

    })
    var vpdtlist = await resData.json();
    console.log(vpdtlist);
    showCart();
}
async function showCart() {

    //fetch the product from db
    var resData = await fetch("http://localhost:3000/display", {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"
        }

    });
    var dispcart = await resData.json();
    console.log(dispcart);
    mycart.innerHTML = "";

    //populate the fetched data in the table

    var trow = mycart.insertRow();
    var hd1 = trow.insertCell(0);
    hd1.innerHTML = "PRODUCT";
    var hd2 = trow.insertCell(1);
    hd2.innerHTML = "Quantity";
    var hd3 = trow.insertCell(2);
    hd3.innerHTML = "Delete";
    var hd4 = trow.insertCell(3);
    hd4.innerHTML = "Edit";

    for (i = 0; i < dispcart.length; i++) {
        var row = mycart.insertRow();

        var cell1 = row.insertCell(0);
        cell1.innerHTML = dispcart[i].product;
        var cell2 = row.insertCell(1);
        cell2.innerHTML = dispcart[i].quantity;
        var cell3 = row.insertCell(2);

        //delete option
        img = document.createElement("img");
        img.id = dispcart[i]._id
        img.src = "trash.jpg";
        img.style.cursor = "pointer";
        img.style.width = "25px";
        cell3.appendChild(img);
        (function (i) {
            img.onclick = function () {
                var rowid = row.parentNode.parentNode.rowIndex;
                //document.getElementById("mycart").deleteRow(rowid);
                delItem(dispcart[i].product, rowid,dispcart[i]._id);
            }
        })(i);

        //update option
        var cell4 = row.insertCell(3);
        cell4.id = "cell4" + i;
        img = document.createElement("img");
        img.id = dispcart[i]._id
        img.src = "edit.png";
        img.style.cursor = "pointer";
        img.style.width = "25px";
        cell4.appendChild(img);
        (function (i) {
            img.onclick = function () {
                // document.getElementById("editPopup").style.display = "block";
                var rowid = row.parentNode.parentNode.rowIndex;
                updateItem(dispcart[i].product,dispcart[i]._id)
            }
        })(i);
    }
}

async function delItem(item, rowid,id) {

    //delete clicked item from db
    var data = { product: item ,_id:id}
    console.log(data);
    var resData = await fetch("http://localhost:3000/delete/"+data._id, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    var finData = await resData.json()
    console.log(finData);
    showCart();

}

async function updateItem(item,id) {

    //update the quatity for the given product
    var data = {
        product: document.getElementById("essentials").value,
        quantity: document.getElementById("quantity").value
        //  edit_prod: document.getElementById("edit_prod").value,
        //  edit_quan: document.getElementById("edit_quan").value
    }
    console.log(data);
    var resData = await fetch("http://localhost:3000/update/"+ id, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    var finData = await resData.json();

    console.log(finData);

    showCart();
}

async function logout() {

    //logout from the current user
    var resData = await fetch("http://localhost:3000/logout", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"
        },

    })
    var finData = await resData.json();

    console.log(finData);
    localStorage.clear();
     location.replace("loginform.html");
}

async function userInfo()
{
    var userid=localStorage.getItem("userid");
    console.log(userid)
    var resData = await fetch("http://localhost:3000/user/"+ userid, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"
        }

    });
    var finData = await resData.json();
    var details="Name:"+ finData.name +"<br>"+"Gender:"+finData.gender+"<br>"+"DateOfBirth:"+finData.dob+"<br>"
    document.getElementById("userDet").innerHTML=details
    
}

