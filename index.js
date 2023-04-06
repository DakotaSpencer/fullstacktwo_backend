var mysql = require('mysql');
const bcrypt = require("bcryptjs");
const routes = require("routes/routes")

const app = express();

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-Width, Content-Type, Accept");
    next();
});

app.get('/api')

app.post('/register', routes.register)

app.post('/login', routes.login)

app.put('/user', routes.updateUser)

app.get('/user', routes.getUser)

app.delete('/user', routes.deleteUser)

app.post('/message', routes.createMessage)

app.get('/messages', routes.getMessagesByUser)

app.get('/order', routes.getOrder)

app.post('/order', routes.createOrder)

app.get('/ordersByShop', routes.getOrdersByShop)

app.get('/ordersByUser', routes.getOrdersByUser)

app.put('/order', routes.updateOrder)

app.post('/wishlist', routes.addToWishlist)

app.delete('/wishlist', routes.deleteFromWishlist)

app.listen(3000);