const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const mysqlConnection = require('../database.js');

//let token = req.headers.authorization.split(" ")[1];
//var decoded = jwt.verify(token, process.env.JWT_KEY);
//console.log(decoded.role) // get role

/*
    // sucess 
    return res.status(201).json({
        message: "??????"
    });

    // sucess 
    return res.status(200).json(??); //objet

    //error
    return res.status(401).json({
        message: "??????"
    });




    mysqlConnection.query({
        sql: 'SELECT * FROM users WHERE `email` = ? or email = ?',
        timeout: 10000, // 10s
        values: [var1,var2]
    }, (err, rows, fields) => {
        if (!err) {
            //res.status(201).json(rows);
        } else {
           // return res.status(401).json({
           //     error: "error"
           // });
        }
    });


*/

exports.userSignup = (req, res) =>{
 
    let value1 = req.body.email;
    let value2 = req.body.password;
    let value3 = 'Customer';

    let Regx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if(Regx.test(value1)){
        mysqlConnection.query({
            sql: 'SELECT * FROM users WHERE `email` = ?',
            timeout: 10000, // 10s
            values: [value1]
        }, (err, rows, fields) => {
            if (!err) {
                if(rows.length == 0){
                    let Regx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
                    if(Regx.test(value2)){
                        //all good
                        bcrypt.hash(value2, 16,(err, hash) => {
                            mysqlConnection.query({
                                sql: 'INSERT INTO users VALUES (NULL, ?, ?, ?)',
                                timeout: 10000, // 10s
                                values: [value1,hash,value3]
                            }, (err, rows, fields) => {
                                if (!err) {
                                    return res.status(201).json({
                                        message: "account created sucessfully"
                                    });
                                } else {
                                    return res.status(401).json({
                                        message: "couldn't create an account, please contact administration"
                                    });
                                }
                            });
                        }) 
                    }else{
                        return res.status(401).json({
                            message: "not a valid password",
                            hint : "Minimum eight characters, at least one letter, one number and one special character"
                        });
                    }
                }else{
                    return res.status(401).json({
                        message: "user already exist, please login"
                    });
                }
            } else {
                return res.status(401).json({
                    message: "Something is wrong, please contact administration"
                });
            }
        });
    }else{
        return res.status(401).json({
            message: "not a valid email adress"
        });
    }

    

 

};

exports.userSignin = (req, res, next) =>{

    let value1 = req.body.email;
    let value2 = req.body.password;

    

   
    
    

    let Regx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if(Regx.test(value1)){
        // verification code is needed
        mysqlConnection.query({
            sql: 'SELECT * FROM users WHERE email =  ?',
            timeout: 10000, // 10s
            values: [value1]
        }, (err, rows, fields) => {
            if (!err) {
                if(rows.length == 1){
                    if(/*value2 match rows.password*/true){
                       // bcrypt

                    }else{
                         //password is not correct
                    }
                }else{
                    //user does not exist
                }

                /*
                const token = jwt.sign(
                    {
                        idUser: rows[0].idUser,
                        email: rows[0].email,
                        role: rows[0].role
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1m'
                    }
                );
                const refreshToken = jwt.sign(
                    {
                        idUser: rows[0].idUser,
                        email: rows[0].email,
                        role: rows[0].role
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }  
                );
                let UserRes = {
                    idUser : rows[0].idUser,
                    email: rows[0].email,
                    role: rows[0].role,
                    token: token,
                    refreshToken: refreshToken
                }
                res.json(UserRes);
                */
            } else {
                //error
            }
        });
    }else{
        //not a valid email
    }

    


};

exports.setPersonalInfo = (req, res, nex) => {
    // verification code is needed
        console.log(req.params.idUser)
        //let query = "INSERT INTO personalinfo VALUES (NULL,'"++"','"++"','"++"','"++"')";
    
        let query = {
            sql: 'INSERT INTO personalinfo VALUES (NULL, ?, ?, ?, ?)',
            timeout: 10000, // 10s
            values: [req.body.firstName,req.body.lastName,req.body.status,req.params.idUser]
        }
        //console.log(query)
        mysqlConnection.query(query, (err, rows, fields) => {
            if (!err) {
                res.status(201).json(
                    {message : "info inserted"}
                )
            } else {
                return res.status(401).json({
                    error: "insertion error"
                });
            }
        });
};
    
exports.addAdress = (req, res, next) => {
    //console.log(req.body);
    let value1 = req.body.fullName;
    let value2 = req.body.address1;
    let value3 = req.body.address2;
    let value4 = req.body.zipCode;
    let value5 = req.body.city;
    let value6 = req.body.region;
    let value7 = req.body.country;
    let value8 = req.body.idUser;

    mysqlConnection.query({
        sql: 'INSERT INTO billingadress VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)',
        timeout: 10000, // 10s
        values: [value1,value2,value3,value4,value5,value6,value7]
    }, (err, rows, fields) => {
        if (!err) {
            mysqlConnection.query({
                sql: 'INSERT INTO useradress VALUES (NULL, ?, ?)',
                timeout: 10000, // 10s
                values: [rows.insertId,value8]
            }, (err, rows, fields) => {
                if (!err) {
                    res.status(201).json(rows);
                } else {
                    return res.status(401).json({
                        error: "error"
                    });
                }
            });

            //res.status(201).json(rows.insertId);
        } else {
            return res.status(401).json({
                error: "error"
            });
        }
    });

};

exports.setShippingAdress = (req, res, next) => {
    let value1 = req.body.sameAsBilling;
    let value2 = req.body.idBillingAdress;
    let value3 = req.body.idUser;
    let value4 = req.body.note;

    mysqlConnection.query({
        sql: 'INSERT INTO shippingadress VALUES (NULL, ?, ?, ?, ?)',
        timeout: 10000, // 10s
        values: [value1,value2,value3,value4]
    }, (err, rows, fields) => {
        if (!err) {
            res.status(201).json(rows);
        } else {
            return res.status(401).json({
                error: "error"
            });
        }
    });

};

exports.updatePersonalInfo = (req, res, next) => {
    console.log("updatePersonalInfo");
};

exports.updateAdress = (req, res, next) => {
    console.log("updateAdress");
};

exports.updateShippingAdress = (req, res, next) => {
    console.log("updateShippingAdress");
};

exports.getPersonalInfo = (req, res, next) => {
    console.log("getPersonalInfo");
};

exports.getUserAdress = (req, res, next) => {
    console.log("getUserAdress");
};

exports.getShippingAdress = (req, res, next) => {
    console.log("getShippingAdress");
};

exports.deleteAdress = (req, res, next) => {
    console.log("deleteAdress");
};

exports.deleteShippingAdress = (req, res, next) => {
    console.log("deleteShippingAdress");
};

exports.deletePersonalInfo = (req, res, next) => {
    console.log("deletePersonalInfo");
};








