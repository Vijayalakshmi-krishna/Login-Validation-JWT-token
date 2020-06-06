const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb');
const url = "mongodb://localhost:27017"
const bcrypt = require('bcrypt');
const saltrounds = 10;
const jwt = require('jsonwebtoken');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//function to authenticate the user with valid JWT token
function authenticate(req, res, next) {
    let header = req.header('Authorization')
    
    if (header == undefined) {
        res.status(401).json({
            message: "unauthorized"
        });
    }
    else {
        //Allow users with valid token
        var decode = jwt.verify(header, 'abcghimno');
        if (decode !== undefined) {
            req.email = decode.email          
            next();
        }
        else {
            res.status('401').json({
                message: "Unauthorized"
            });
        }
    }
}
//New users Route
app.post("/register", function (req, res) {
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        var newData = {
            name:req.body.name,
            gender:req.body.gender,
            dob:req.body.dob,            
            email: req.body.email
        }
        //generate salt
        bcrypt.genSalt(saltrounds, function (err, salt) {
            if (err) throw err;
            //encrypt the password
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err) throw err;
                newData.password = hash;
                //Insert new user into DB
                db.collection("userdetails").insertOne(newData, function (err, result) {
                    if (err) throw err;
                    client.close();
                    res.json({
                        message: "User registered"
                    })
                })
            })
        })



    })


})

//Already registered users Route
app.post("/login", function (req, res) {

    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        db.collection("userdetails").findOne({ email: req.body.email }, function (err, userData) {
            if (err) throw err;
            
            //compare the password and generate jwt token
            bcrypt.compare(req.body.password, userData.password, function (err, result) {

                if (result) {
                    var jwtToken = jwt.sign({ email: req.body.email }, 'abcghimno')
                    res.json({
                        message: "success",
                        token: jwtToken,
                        userid:userData._id
                    })
                }
                else {
                    res.json({
                        message: "Login Failed",
                    })
                }
            })
        })
    })
})

//Logged in users Route
app.get("/dashboard", authenticate, function (req, res) {
    
    res.json({
        message: "protected",
        email:req.email
    })
})

//To get the details of Logged in  user
app.get('/user/:id', function (req, res) {
 var userid=req.params.id 
 var ObjectId = require('mongodb').ObjectID;
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        var userData = db.collection("userdetails").findOne({},{_id:ObjectId(userid)});

        userData.then(function (data) {
            console.log(data);
            console.log("Data Displayed");
            client.close();

            res.json(data)

        })
            .catch(function (err) {
                client.close();
                res.json({
                    message: "error"
                })
            })
    });
});

//add items to the table
app.post("/insert", function (req, res) {
    mongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        var newData = {
            product: req.body.product,
            quantity: req.body.quantity
        }
        db.collection("UserPdt").insertOne(newData, function (err, result) {
            if (err) throw err;
            client.close();
            res.json({
                messsage: "product added"
            })
        })
    })
});

//display all the products from the table
app.get("/display", function (req, res) {
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        var dispcart = db.collection("UserPdt").find().toArray();
        dispcart.then(function (data) {
            console.log(data);
            console.log("Data Displayed");
            client.close();
            res.json(data);
        })
            .catch(function (err) {
                client.close();
                res.json({
                    message: "error"
                })
            })
    });
});

//delete the selected product (using product id)
app.delete("/delete/:id", function (req, res) {
    let pdtid=req.params.id
    console.log(pdtid);
    console.log(req.body);
    var ObjectId = require('mongodb').ObjectID;

    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        db.collection("UserPdt").deleteOne({ _id: ObjectId(pdtid) }, function (err, result) {
            if (err) throw err;
            console.log("deleted in DB");
            client.close();
            res.json({
                message: " product Deleted"
            })
        });
    });
});

//update the quantity for the selected product id
app.put("/update/:id", function (req, res) {
    let pdtid=req.params.id
    console.log(req.body);
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("appdb");
        var ObjectId = require('mongodb').ObjectID;
        db.collection("UserPdt").updateOne(
            { _id: ObjectId(pdtid) },
            { $set: {product:req.body.product,quantity: req.body.quantity} }, function (err, result) {
                if (err) throw err;
                console.log("updated to db");
                client.close();
                res.json({
                    message: "Product updated"
                })
            });

    });
});
//drop the contents of the db
app.get("/logout", function (req, res) {
    mongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db=client.db("appdb");
        db.collection("UserPdt").drop(function(err,result){
            if(err) throw err;
            console.log("db dropped");
            client.close();
            res.json({
                message:"user logged out"
            })
        })
    })
});



app.listen(3000, function () {
    console.log("Port is running in 3000...")
})