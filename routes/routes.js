const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const { randomUUID } = require('crypto');
const { Console } = require('console');

var con = mysql.createConnection({
    host: "catgirl-film-reviews.ccskcsxljvdp.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "tLXN4yhYHSkDK8R",
    database: "the_cats_cradle",
    multipleStatements: true
});

exports.index = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Connected To Backend</h1>');
}

exports.register = (req, res) => {
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
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt)
    const uuid = randomUUID()
    sql += `"${uuid}","${userData.email}","${hash}","${userData.display_name}"`
    if (userData.address.first_name) {
        sql += `,"${userData.address.first_name}","${userData.address.last_name},","${userData.address.street[0]}","${userData.address.street?.[1] || null}","${userData.address.city}","${userData.address.state}","${userData.address.country}");`
    } else {
        sql += ");"
    }
    sql += `\nSELECT user_uuid FROM users WHERE user_uuid = '${uuid}'`
    console.log(sql)
    con.query(sql,[1,2], function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(result[1])
    });
}

exports.login = (req,res) => {
    /*
        req:
        {
            user_name
            user_password
        }

        res:
        {
            success (bool)
            user_id (on success)
            message (on failure)
        }
    */
    let submitData = req.body
    con.query("SELECT * FROM users WHERE user_email = " + mysql.escape(submitData.user_email), function(err, queryResult, fields) {
        if(err) {
            res.send(err)
            return
        }
        bcrypt.compare(submitData.user_password, queryResult[0].user_password, function(err, compareResult) {
            if(err) {
                res.send(err)
                return
            }
            if(compareResult) {
                res.send({ success: true, user_id: queryResult[0].user_uuid })
                return
            } else {
                res.send({ success: false, message: 'passwords do not match' })
                return
            }
        })            
    })
}

exports.updateUser = (req, res) => {
    let userId = req.params.id
    let userBody = req.body
    // user_email,
    // user_password,
    // user_display_name,
    // user_first_name,
    // user_last_name,
    // user_street_line1,
    // user_street_line2,
    // user_city,
    // user_state,
    // user_country
    let sql = `UPDATE users SET`;
    if(userBody.user_email != null) { sql += ` user_email = ` + mysql.escape(userBody.user_email)}
    if(userBody.user_password != null) { sql += ` user_password = ` + mysql.escape(userBody.user_password)}
    if(userBody.user_display_name != null) { sql += ` user_display_name = ` + mysql.escape(userBody.user_display_name)}
    if(userBody.user_first_name != null) { sql += ` user_first_name = ` + mysql.escape(userBody.user_first_name)}
    if(userBody.user_last_name != null) { sql += ` user_last_name = ` + mysql.escape(userBody.user_last_name)}
    if(userBody.user_display_name != null) { sql += ` user_display_name = ` + mysql.escape(userBody.user_display_name)}
    if(userBody.user_street_line1 != null) { sql += ` user_street_line1 = ` + mysql.escape(userBody.user_street_line1)}
    if(userBody.user_street_line2 != null) { sql += ` user_street_line2 = ` + mysql.escape(userBody.user_street_line2)}
    if(userBody.user_city != null) { sql += ` user_city = ` + mysql.escape(userBody.user_city)}
    if(userBody.user_state != null) { sql += ` user_state = ` + mysql.escape(userBody.user_state)}
    if(userBody.user_country != null) { sql += ` user_country = ` + mysql.escape(userBody.user_country)}
    sql += `WHERE user_uuid = ` + mysql.escape(userId)
    try {
        con.query(sql, function (err, result) {
            if (err) {
                res.send(err)
                return
            }
            res.send({
                data: result[0]
            })
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }

}

exports.getUser = async (req, res) => {
    let userId = req.params.id
    let sql = `SELECT * FROM users WHERE user_uuid = "${userId}"`
    try {
        con.query(sql, function (err, result) {
            if (err) {
                res.send(err)
                return
            }
            res.status(200).json({
                data:result[0]
            })
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }


}

exports.deleteUser = (req, res) => {
    let userId = req.params.id
    let sql = `DELETE FROM users WHERE user_uuid = "${userId}"`
    try {
        con.query(sql, function (err, result) {
            if (err) {
                res.send(err)
                return
            }
            res.status(200).json({
                data:result[0]
            })
        });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getOrderById = (req,res) => {
    /*
        GET /order/{uuid}
    */
    const uuid = req.params.orderId;
    let sql = "SELECT * FROM orders WHERE order_uuid = " + mysql.escape(uuid);

    con.query(sql, function(err, result) {
        if(err) {
            res.send(err)
            return
        }
        res.send({ result })
    })
}

exports.createOrder = (req,res) => {
    res.send("Get order")
    /*
    {
        buyer_id: int
        order_listing_id: int
        order_quantity: int
    }
    */
    // let orderData = req.body;
    // let sql = "INSERT INTO orders (order_uuid, buyer_id, order_listing_id, order_quantity) VALUES (" + `"${randomUUID()}"` + ", " + orderData.buyer_id + ", " + orderData.order_listing_id + ", " + orderData.order_quantity + ")";
    
    // con.query(sql, function(err, result) {
    //     if (err) {
    //         res.send(err)
    //         return
    //     }
    //     res.send(result[0])
    // })
}

exports.updateOrder = (req,res) => {
    /*
    {
        buyer_id: int
        order_listing_id: int
        order_quantity: int
    }
    */
    res.send("update order")
}

exports.deleteOrder = (req,res) => {
    /*
        DELETE /order/{uuid}
    */
    const uuid = req.params['orderId'];
    let sql = "DELETE FROM orders WHERE order_uuid = " + mysql.escape(uuid);
    con.query(sql, function(err, results) {
        if (err) {
            res.send(err);
            return;
        }
        res.send({ 'success': true })
    })
}

exports.getOrdersFromSeller = (req,res) => {
    res.send(req.params.sellerId)
} //can have listing id and customer id in query params

exports.getOrdersFromBuyer = (req, res) => {
        res.send(req.params.buyerId)
    } //can have seller id in query params

exports.getWishlistListings = (req,res) => {
    
    let sql = `select * from getWishlistListings where user_uuid = "${req.params.userId}"`
    console.log(sql)
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(result)
    });
}

exports.addToWishlist = (req, res) => {
    let sql = `INSERT INTO wishlist_listings (listing_id,wishlist_id) VALUES (${req.params.listingId},${req.params.wishlistId})`
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json({response:"Listing Added"})
    });
}

exports.deleteFromWishlist = (req, res) => {
    let sql = `DELETE FROM wishlist_listings WHERE listing_id = ${req.params.listingId} and wishlist_id = ${req.params.wishlistId}`
    console.log(sql)
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json({response:"Listing Deleted"})
    });
}

exports.createWishlist = (req,res) => {
    /*create table wishlists (
	wishlist_id int auto_increment not null,
    primary key (wishlist_id),
    wishlist_uuid varchar(30) not null unique,
    wishlist_name varchar(30) not null default("Likes"),
    wishlist_user_id int not null,
    foreign key (wishlist_user_id) references users(user_id) on delete cascade
);

create table wishlist_listings (
	wishlist_id int not null,
    listing_id int not null,
    foreign key (listing_id) references listings(listing_id) on delete cascade,
    foreign key (wishlist_id) references wishlists(wishlist_id) on delete cascade
); 

    {
        user_id,
        wishlist_name,
    }*/
    const uuid = randomUUID();
    let sql = `INSERT INTO wishlists (wishlist_uuid,wishlist_name,wishlist_user_id) VALUES ("${uuid}","${req.body.wishlist_name}",${req.body.user_id});
    SELECT * FROM wishlists WHERE wishlist_uuid = "${uuid}"`
    con.query(sql,[1,2], function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(result[1])
    });
}

exports.updateWishlist = (req,res) => {
    let sql = `UPDATE wishlists SET wishlist_name = "${req.params.name}" WHERE wishlist_uuid = "${req.params.wishlistUUID}"`
    console.log(sql)
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json({response:"List Deleted"})
    });
}

exports.deleteWishlist = (req,res) => {
    let sql = `DELETE FROM wishlists WHERE wishlist_uuid = "${req.params.wishlistUUID}"`
    console.log(sql)
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json({response:"List Deleted"})
    });
}

exports.createListing = (req,res) => {
    /*
    create table listings (
	listing_id int auto_increment not null,
    primary key (listing_id),
    listing_uuid varchar(50) not null unique,
    seller_id int not null,
    foreign key (seller_id) references users(user_id),
    listing_name varchar(50) not null,
    listing_description varchar(1000),
    listing_is_public boolean not null default(true),
    listing_price decimal not null
);

create table listing_image_paths (
	path_id int auto_increment not null,
    primary key (path_id),
    path_text varchar(50) not null,
    path_listing_id int not null,
    foreign key (path_listing_id) references listings(listing_id)
);

create table listing_options (
	option_id int auto_increment not null,
    primary key (option_id),
    option_listing_id int,
    foreign key (option_listing_id) references listings(listing_id),
    option_type_name varchar(20) not null,
    option_name varchar(30) not null,
    option_additional_price decimal not null default(0.0)
);

create table listing_tags (
	listing_id int not null,
    tag_id int not null,
    foreign key (listing_id) references listings(listing_id),
    foreign key (tag_id) references tags(tag_id)
)

drop table if exists tags;
create table tags (
	tag_id int auto_increment not null,
    primary key (tag_id),
    tag_name varchar(20) not null
);
    */

    /*
    {
        seller_id,
        name,
        description,
        is_public,
        price,
        tags [
            tag_name //id generated and new tag created if it doesn't exist, otherwise just a reference is added
        ],
        options {
            [type_name]: [
                option_name,
                option_price
            ]
        }
    }
    */
    let listingData = req.body;
    /*
    insert into listings (listing_uuid,seller_id,listing_name,listing_description,listing_is_public,listing_price) values ("cfc4ba05-8f34-4e5a-adb8-c307e7f6759f",1,"Bag","A bag what you can use",true,49.99);
    INSERT INTO listing_options (option_listing_id,option_type_name,option_name,option_additional_price) VALUES	(1,"Size","Small",0);
    */
    const uuid = randomUUID();
    let sql = `INSERT INTO listings (listing_uuid,seller_id,listing_name,listing_description,listing_is_public,listing_price) VALUES ('${uuid}',${listingData.seller_id},'${listingData.name}','${listingData.description}',${listingData.is_public},${listingData.price});\n`
    sql += `SELECT * FROM listings WHERE listing_uuid = '${uuid}'`
    con.query(sql,[1,2], function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        addListingOptions(result[1][0].listing_id,listingData.options,listingData.tags,res)
    });
    

};

exports.getAllListings = (req, res) => {
    let sql =  `SELECT * FROM listings WHERE listing_is_public = 1 ORDER BY listing_id DESC;`

    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(result)
    });
}

exports.getListingById = (req,res) => {
    let listingId = req.params.id;
    let sql =  `SELECT * FROM getListing WHERE listing_uuid = "${listingId}";\n`
    sql += `SELECT * FROM getListingTags WHERE listing_uuid = "${listingId}";\n`
    sql += `SELECT * FROM getListingOptions WHERE listing_uuid = "${listingId}";\n`
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(formatListingResults(result))
    });
}

const getTagIds = (tags,id,res) => {
    let sql = 'INSERT IGNORE INTO tags (tag_name) VALUES '
    let sqlLinetwo = "SELECT tag_id from tags WHERE tag_name = "
    tags.forEach((tag,index) => {
        sql += `('${tag.toLowerCase()}')`
        sqlLinetwo += `'${tag.toLowerCase()}'`
        if (index < tags.length-1) {
            sql += ","
            sqlLinetwo += " | "
        }
    })
    sql += ";\n" + sqlLinetwo;
    con.query(sql,[1,2], function(err, result) {
        if (err) {
            console.log(err)
            return
        }
        addListingTags(result[1],id,res)
    });
}

const addListingTags = (tagIds,listingId,res) => {
    let sql = 'INSERT INTO listing_tags (tag_id,listing_id) VALUES '
    tagIds.forEach((id,index) => {
        sql += `(${id.tag_id},${listingId})`
        if (index < tagIds.length-1)
            sql += ","
    })
    sql +=  `;\nSELECT * FROM getListing WHERE listing_id = ${listingId};\n`
    sql += `SELECT * FROM getListingTags WHERE listing_id = ${listingId};\n`
    sql += `SELECT * FROM listing_options WHERE option_listing_id = ${listingId};\n`
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(formatListingResults(result.slice(1)))
    });
}

const formatListingResults = (listingData) => {

    /*{
        seller_display_name,
        seller_uuid,
        name,
        description,
        is_public,
        price,
        tags [
            tag_name //id generated and new tag created if it doesn't exist, otherwise just a reference is added
        ],
        options {
            [type_name]: [
                option_name,
                option_price
            ]
        }
    } 
    
    [
        {
            "listing_id": 32,
            "listing_uuid": "fe8fb2bf-9aa6-44df-84b3-af92daf364dd",
            "seller_id": 6,
            "listing_name": "Bag",
            "listing_description": "A bag what you can use",
            "listing_is_public": 1,
            "listing_price": 50
        }
    ],
    [
        {
            "listing_id": 32,
            "tag_name": "accessories",
            "tag_id": 2
        },
        {
            "listing_id": 32,
            "tag_name": "clothing",
            "tag_id": 1
        }
    ],
    [
        {
            "option_id": 12,
            "option_listing_id": 32,
            "option_type_name": "color",
            "option_name": "Red",
            "option_additional_price": 0
        },
        {
            "option_id": 13,
            "option_listing_id": 32,
            "option_type_name": "color",
            "option_name": "Blue",
            "option_additional_price": 0
        },
        {
            "option_id": 14,
            "option_listing_id": 32,
            "option_type_name": "color",
            "option_name": "Green",
            "option_additional_price": 0
        },
        {
            "option_id": 15,
            "option_listing_id": 32,
            "option_type_name": "color",
            "option_name": "Gold",
            "option_additional_price": 5
        }
    ]*/
    let output = {...listingData[0][0]};
    let tags = []
    let options = {}
    listingData[1].forEach(tag => {
        tags = [...tags,tag.tag_name]
    })
    listingData[2].forEach(option => {
        options[option.option_type_name] = options[option.option_type_name] || []
        options[option.option_type_name] = [...options[option.option_type_name],{name:option.option_name,price:option.option_additional_price}]
    })
    output = {...output,tags,options}
    return output
}

const addListingOptions = (listingId,options,tags,res) => {

    /*
    create table listing_options (
	option_id int auto_increment not null,
    primary key (option_id),
    option_listing_id int,
    foreign key (option_listing_id) references listings(listing_id),
    option_type_name varchar(20) not null,
    option_name varchar(30) not null,
    option_additional_price decimal not null default(0.0) */
    let sql = "INSERT INTO listing_options (option_listing_id,option_type_name,option_name,option_additional_price) VALUES "
    Object.keys(options).forEach((optionType,index) => {
        options[optionType].forEach((option,i) => {
            sql += `(${listingId},"${optionType}",'${option.option_name}','${option.option_price}')`
            if (i < options[optionType].length-1)
                sql += ","
        })
        if (index < Object.keys(options).length - 1) 
            sql += ","
    })
    con.query(sql, function(err, result) {
        if (err) {
            return
        }
        console.log(result)
        getTagIds(tags,listingId,res)
    });

}

exports.searchListings = (req,res) => {
    const query = req.query.q;
    let sql = `SELECT * FROM getListing WHERE listing_name LIKE '%${query}%' OR seller_name LIKE '%${query}%'`
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(result)
    });
}