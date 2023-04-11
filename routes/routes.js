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
    res.send("register")
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