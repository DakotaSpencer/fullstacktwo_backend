const routes = require("./routes/routes")
const express = require("express")
const cors = require('cors');

const app = express();
app.use(cors());
const port=process.env.PORT || 4000

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
    next();
});

app.use(express.json());

app.get('/', routes.index)

app.post('/register', routes.register)

app.post('/login', routes.login)

app.put('/user/:id', routes.updateUser)

app.get('/user/:id', routes.getUser)

app.delete('/user/:id', routes.deleteUser)

// app.post('/message', routes.createMessage)

// app.get('/messages', routes.getMessagesByUser)

app.get('/order/:orderId', routes.getOrderById)

app.get('/order', routes.getOrders)

app.post('/order', routes.createOrder)

app.get('/wishlist/:wishlistId/add/:listingId', routes.addToWishlist)

app.post('/wishlist', routes.createWishlist)

app.get('/wishlist/:userId', routes.getWishlistListings)

app.delete('/wishlist/:wishlistUUID', routes.deleteWishlist)

app.delete('/wishlist/:wishlistId/delete/:listingId', routes.deleteFromWishlist)

app.post("/listing",routes.createListing)

app.delete("/listing",routes.deleteListing)

app.get("/all-listings", routes.getAllListings)

app.get("/listing/:id", routes.getListingById)

app.get("/search", routes.searchListings)

//app.get("/listing/seller/:id",routes.getListingBySeller)

app.listen(port);