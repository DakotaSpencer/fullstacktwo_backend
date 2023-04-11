const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const { randomUUID } = require('crypto');

var con = mysql.createConnection({
    host: "catgirl-film-reviews.ccskcsxljvdp.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "tLXN4yhYHSkDK8R",
    database: "cats_frontend_two"
});

exports.register = (req,res) => {
    /*user_id int auto_increment not null,
    primary key (user_id),
    user_uuid varchar(50) not null unique,
    user_email varchar(300) not null unique,
    user_password varchar(20) not null,
    user_display_name varchar(50) not null unique,
    user_first_name varchar(20),
    user_last_name varchar(30),
    user_street_line1 varchar(50),
    user_street_line2 varchar(20),
    user_city varchar(20),
    user_state varchar(20),
    user_country varchar(50)*/

    /////////////////////

    /*
    {
        email,
        password,
        display_name,
        address {
            first_name,
            last_name,
            street [], //can have 1 or 2 lines
            city,
            state,
            country
        }
    }
    */
    let userData = req.body
    let sql = `INSERT INTO users (user_uuid,user_email,user_password,user_display_name${userData?.address?.first_name ? ",user_first_name,user_last_name,user_street_line1,user_street_line2,user_city,user_state,user_country" : ""}) VALUES (`
    console.log("Count",sql.split(","))
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password,salt)
    sql += `"${randomUUID()}","${userData.email}","${hash}","${userData.display_name}`
    if (userData.address.first_name) {
        sql += `","${userData.address.first_name}","${userData.address.last_name},","${userData.address.street[0]}","${userData.address.street?.[1] || null}","${userData.address.city}","${userData.address.state}","${userData.address.country}")`
    } else {
        sql += ")"
    }
    console.log("Count",sql.split(","))
    console.log(sql)
    con.connect(function(err) {
        if (err) {
            res.send(err)
            return
        }
        console.log("Connected!");
        con.query(sql, function (err, result) {
            if (err) {
                res.send(err)
                return
            }
            res.send(result[0])
        });
    });
}

exports.login = (req,res) => {
    res.send("login")
}

exports.updateUser = (req,res) => {
    res.send("update user")
}

exports.getUser = (req,res) => {
    res.send("get user")
}

exports.deleteUser = (req,res) => {
    res.send("delete user")
}

exports.getOrderById = (req,res) => {
    res.send(req.params.orderId)
}

exports.createOrder = (req,res) => {
    res.send("create order")
}

exports.updateOrder = (req,res) => {
    res.send("update order")
}

exports.getOrdersFromSeller = (req,res) => {
    res.send(req.params.sellerId)
} //can have listing id and customer id in query params

exports.getOrdersFromBuyer = (req,res) => {
    res.send(req.params.buyerId)
} //can have seller id in query params

exports.addToWishlist = (req,res) => {
    res.send(req.params.userId + " " + req.params.wishlistId + " " + req.params.listingId)
}

exports.deleteFromWishlist = (req,res) => {
    res.send(req.params.userId + " " + req.params.wishlistId + " " + req.params.listingId)
}