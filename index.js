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

app.listen(3000);