
async function signin() {

    var data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };
    //Login for registered
    var resData = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "content-Type": "application/json"

        },
        body: JSON.stringify(data)

    })

    var rData = await resData.json();
    console.log(rData);
    var vtoken = (rData.token);
    console.log(vtoken);
    //store the token in local storage

    localStorage.setItem('token', vtoken);


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", vtoken);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    //get the decoded token for token verified users

    var resData = await fetch("http://localhost:3000/dashboard", requestOptions)

    var finData = await resData.json();


    console.log(finData);
    alert("user login verified")
    localStorage.setItem("email", finData.email)
    localStorage.setItem("userid",rData.userid)
    location.replace("dashboard.html");

}