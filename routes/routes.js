const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const { randomUUID } = require('crypto');

var con = mysql.createConnection({
    host: "catgirl-film-reviews.ccskcsxljvdp.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "tLXN4yhYHSkDK8R",
    database: "the_cats_cradle",
    multipleStatements: true
});

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
    console.log("Count", sql.split(","))
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
    con.connect(function(err) {
        if (err) {
            res.send(err)
            return
        }
        console.log("Connected!");
        con.query(sql,[1,2], function(err, result) {
            if (err) {
                res.send(err)
                return
            }
            res.json(result[1])
            con.end();
        });
    });
}

exports.login = (req, res) => {
    res.send("login")
}

exports.updateUser = (req, res) => {
    let userId = req.params.id
    let userBody = req.body
    let sql = `UPDATE customers SET user_first_name = '${userBody.user_first_name}',  WHERE user_uuid = "${userId}"`
    trySQL(req, res, sql);
}

exports.getUser = (req, res) => {
    let userId = req.params.id
    let sql = `SELECT * FROM users WHERE user_uuid = "${userId}"`
    trySQL(req, res, sql);


}

exports.deleteUser = (req, res) => {
    let userId = req.params.id
    let sql = `DELETE FROM users WHERE user_uuid = "${userId}"`
    const result = trySQL(req, res, sql);

    if (result[0])
        res.status(200).json(result)
}

exports.getOrderById = (req, res) => {
    res.send(req.params.orderId)
}

exports.createOrder = (req, res) => {
    res.send("create order")
}

exports.updateOrder = (req, res) => {
    res.send("update order")
}

exports.getOrdersFromSeller = (req, res) => {
        res.send(req.params.sellerId)
    } //can have listing id and customer id in query params

exports.getOrdersFromBuyer = (req, res) => {
        res.send(req.params.buyerId)
    } //can have seller id in query params

exports.addToWishlist = (req, res) => {
    res.send(req.params.userId + " " + req.params.wishlistId + " " + req.params.listingId)
}

exports.deleteFromWishlist = (req, res) => {
    res.send(req.params.userId + " " + req.params.wishlistId + " " + req.params.listingId)
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
    con.connect(function(err) {
        if (err) {
            res.send(err)
            return
        }
        con.query(sql,[1,2], function(err, result) {
            if (err) {
                res.send(err)
                return
            }
            addListingOptions(result[1][0].listing_id,listingData.options,listingData.tags,res)
        });
    });
    

};

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
    sql +=  `;\nSELECT * FROM listings WHERE listing_id = ${listingId};\n`
    sql += `SELECT * FROM getListingTags WHERE listing_id = ${listingId};\n`
    sql += `SELECT * FROM listing_options WHERE option_listing_id = ${listingId};\n`
    con.query(sql, function(err, result) {
        if (err) {
            res.send(err)
            return
        }
        res.json(formatListingResults(result.slice(1)))
        con.end();
    });
}

const formatListingResults = (listingData) => {

    /*{
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

function trySQL(req, res, sql) {
    try {
        con.connect(function(err) {
            if (err) {
                res.send(err)
                return
            }
            console.log("Connected!");
            con.query(sql, function(err, result) {
                if (err) {
                    res.send(err)
                    return
                }
                return result
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}