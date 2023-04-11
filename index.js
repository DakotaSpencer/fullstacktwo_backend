const routes = require("./routes/routes")
const express = require("express")

const app = express();

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-Width, Content-Type, Accept");
    next();
});

app.post('/register', routes.register)

app.post('/login', routes.login)

app.put('/user', routes.updateUser)

app.get('/user', routes.getUser)

app.delete('/user', routes.deleteUser)

// app.post('/message', routes.createMessage)

// app.get('/messages', routes.getMessagesByUser)

app.get('/order/:orderId', routes.getOrderById)

app.post('/order', routes.createOrder)

app.put('/order', routes.updateOrder)

app.get('/orders/seller/:sellerId', routes.getOrdersFromSeller) //can have listing id and customer id in query params

app.get('/orders/customer/:customerId', routes.getOrdersFromBuyer) //can have seller id in query params

app.get('/user/:userId/wishlist/:wishlistId/add/:listingId', routes.addToWishlist)

app.delete('/wishlist/:wishlistId/delete/:listingId', routes.deleteFromWishlist)

app.listen(3000);