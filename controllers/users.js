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
            res.status(201).json(rows);
        } else {
            return res.status(401).json({
                error: "error"
            });
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
                                        message: "couldn't create an account, please contact administration",
                                        info: err.sqlMessage
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
    let self = res;

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
                    bcrypt.compare(value2, rows[0].password, function(err, res) {
                        if(err){
                            return res.status(401).json({
                                message: "Something is wrong, please contact administration"
                            });
                        }
                        if(!res){
                            return self.status(401).json({
                                message: "password do not match"
                            });
                        }else{
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
                            self.status(200).json(UserRes);
                        }                
                    })
                }else{
                    return res.status(401).json({
                        message: "User Does not exist"
                    });
                }
            } else {
                return res.status(401).json({
                    message: "Something is wrong, please contact administration",
                    info: err.sqlMessage
                });
            }
        });
    }else{
        return res.status(401).json({
            message: "not a valid email adress"
        });
    }

    


};

exports.setPersonalInfo = (req, res, nex) => {
        let token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.JWT_KEY);

        if(decoded.role == 'Customer' && decoded.idUser != req.params.idUser){
            return res.status(401).json({
                error: "you do not have the permission to execute this action, your information has been loged in our system"
                //TODO: create a log
            });
        }else{
            let regex = /(\+212|0)([ \-_/]*)(\d[ \-_/]*){9}/; //valid morocan phone number +2126...
            if(regex.test(req.body.phone)){
                let regex = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/; // name // try not to include special character symbols
                if(regex.test(req.body.firstName)){
                    if(regex.test(req.body.lastName)){
                        let regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/; // ex :  2014-02-04 12:34
                        if(regex.test(req.body.birthDay)){
                            if(typeof(req.body.gender) == 'boolean'){
                                if(typeof(req.body.type) == 'boolean'){
                                    
                                    let query = {
                                        sql: 'INSERT INTO personalinfo VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
                                        timeout: 10000, // 10s
                                        values: [req.body.firstName,req.body.lastName,'pending',req.body.birthDay,req.body.gender,req.body.phone,req.body.type,req.params.idUser]
                                    }
                                    mysqlConnection.query(query, (err, rows, fields) => {
                                        if (!err) {
                                            res.status(201).json(
                                                {message : "inserted sucessfully"}
                                            )
                                        } else {
                                            return res.status(401).json({
                                                error: "somthing is worong, please contact support",
                                                info: err.sqlMessage
                                            });
                                        }
                                    });
                                }else{
                                    return res.status(401).json({
                                        error: "account type is not valid"
                                    });
                                }
                            }else{
                                return res.status(401).json({
                                    error: "gender is not valid"
                                });
                            }
                        }else{
                            return res.status(401).json({
                                error: "not a valid date -- allows timestamp dates like '2014-02-04 12:34' "
                            });
                        }
                    }else{
                        return res.status(401).json({
                            error: "not a valid lastName try not to include special characters like é or â"
                        });
                    }
                }else{
                    return res.status(401).json({
                        error: "not a valid firstname try not to include special characters like é or â"
                    });
                }
            }else{
                return res.status(401).json({
                    error: "not a valid phone number, only morocan phone number +2126..."
                });
            }
        }      
};
    
exports.addAdress = (req, res, next) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(decoded.role == 'Customer' && decoded.idUser != req.body.idUser){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        let value1 = req.body.fullName;
        let value2 = req.body.address1;
        let value3 = req.body.address2;
        let value4 = req.body.zipCode;
        let value5 = req.body.city;
        let value6 = req.body.region;
        let value7 = req.body.country;
        let value8 = req.body.idUser;

        let regex = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
        if(regex.test(value1)){
            if(typeof(value4)=="number"){
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
                                return res.status(201).json({
                                    message: "added sucessfully"
                                });
                            } else {
                                return res.status(401).json({
                                    error: "something is wrong, please contact support",
                                    info: err.sqlMessage
                                });
                            }
                        });
                    } else {
                        return res.status(401).json({
                            error: "something is wrong, please contact support",
                            info: err.sqlMessage
                        });
                    }
                });
            }else{
                return res.status(401).json({
                    message: "not a valid zip code"
                });
            }
        }else{
            return res.status(401).json({
                message: "not a valid full name try not to include special characters like â or é"
            });
        } 
    }
};

exports.setShippingAdress = (req, res, next) => {
    //TODO : user verif (role)
    let value1 = req.body.sameAsBilling;
    let value2 = req.body.idBillingAdress;
    let value3 = req.body.idUser;
    let value4 = req.body.note;
    if(typeof(value1) == "boolean"){
        if(typeof(value2) == "number"){
            if(typeof(value3) == "number"){
                if(typeof(value4) == "undefined"){
                    value4 = "";
                }
                mysqlConnection.query({
                    sql: 'INSERT INTO shippingadress VALUES (NULL, ?, ?, ?, ?)',
                    timeout: 10000, // 10s
                    values: [value1,value2,value3,value4]
                }, (err, rows, fields) => {
                    console.log(err)
                    if (!err) {
                        res.status(201).json(
                            {message : "inserted sucessfully"}
                        )
                    }else{
                        return res.status(401).json({
                            error: "something is wrong, please contact support",
                            info: err.sqlMessage
                        });
                    }
                });
            }else{
                return res.status(401).json({
                    error: "not a valid user ID"
                });
            }
        }else{
            return res.status(401).json({
                error: "not a valid billing address ID"
            });
        }
    }else{
        return res.status(401).json({
            error: "not a boolean value, please chose true or false"
        });
    }

    

};

exports.updatePersonalInfo = (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(decoded.role == 'Customer' && decoded.idUser != req.params.idUser){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        let regex = /(\+212|0)([ \-_/]*)(\d[ \-_/]*){9}/; //valid morocan phone number +2126...
        if(regex.test(req.body.phone)){
            let regex = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/; // name // try not to include special character symbols
            if(regex.test(req.body.firstName)){
                if(regex.test(req.body.lastName)){
                    let regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/; // ex :  2014-02-04 12:34
                    if(regex.test(req.body.birthDay)){
                        if(typeof(req.body.gender) == 'boolean'){
                            if(typeof(req.body.type) == 'boolean'){

                                let sqlQ = 'UPDATE personalinfo SET firstName = ?, lastName =? ,birthDay = ?, gender = ?, phone = ?, type = ? WHERE idUser = ?';
                                let vals = [req.body.firstName,req.body.lastName,req.body.birthDay,req.body.gender,req.body.phone,req.body.type,req.params.idUser];
                               
                                if(decoded.role != 'Customer'){
                                    sqlQ = 'UPDATE personalinfo SET firstName = ?, lastName =? ,status = ?, birthDay = ?, gender = ?, phone = ?, type = ? WHERE idUser = ?';
                                    vals = [req.body.firstName,req.body.lastName,req.body.status,req.body.birthDay,req.body.gender,req.body.phone,req.body.type,req.params.idUser];
                                }
                                let query = {
                                    sql: sqlQ,
                                    timeout: 10000, // 10s
                                    values: vals
                                }
                                mysqlConnection.query(query, (err, rows, fields) => {
                                    if (!err) {
                                        res.status(201).json(
                                            {message : "Updated sucessfully"}
                                        )
                                    } else {
                                        return res.status(401).json({
                                            error: "something is worong, please contact support",
                                            info: err.sqlMessage
                                        });
                                    }
                                });
                            }else{
                                return res.status(401).json({
                                    error: "account type is not valid"
                                });
                            }
                        }else{
                            return res.status(401).json({
                                error: "gender is not valid"
                            });
                        }
                    }else{
                        return res.status(401).json({
                            error: "not a valid date -- allows timestamp dates like '2014-02-04 12:34' "
                        });
                    }
                }else{
                    return res.status(401).json({
                        error: "not a valid lastName try not to include special characters like é or â"
                    });
                }
            }else{
                return res.status(401).json({
                    error: "not a valid firstname try not to include special characters like é or â"
                });
            }
        }else{
            return res.status(401).json({
                error: "not a valid phone number, only morocan phone number +2126..."
            });
        }
    }      

};

exports.updateAdress = (req, res, next) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(decoded.role == 'Customer' && decoded.idUser != req.body.idUser){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        let value1 = req.body.fullName;
        let value2 = req.body.address1;
        let value3 = req.body.address2;
        let value4 = req.body.zipCode;
        let value5 = req.body.city;
        let value6 = req.body.region;
        let value7 = req.body.country;
        let value9 = req.params.idAdress;
        console.log(typeof(value9) == 'undefined')
        if(typeof(value9) == 'undefined'){
            return res.status(401).json({
                error: "no id for update has been set"
            });
        }else{
        
            let regex = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
            if(regex.test(value1)){
                
                if(typeof(value4)=="number"){

                    let sqlQ = 'UPDATE billingadress SET fullName = ? ,address1 =? ,address2 = ? ,zipCode = ? ,city = ? ,region = ? ,country = ? WHERE idBillingAdress = ?';
                    let vals = [value1,value2,value3,value4,value5,value6,value7,value9];
                    
                    mysqlConnection.query({
                        sql: sqlQ,
                        timeout: 10000, // 10s
                        values: vals
                    }, (err, rows, fields) => {
                        if (!err) {
                            return res.status(201).json({
                                message: 'Updated sucessfully'
                            });
                        } else {
                            return res.status(401).json({
                                error: "something is wrong, please contact support",
                                info: err.sqlMessage
                            });
                        }
                    });
                }else{
                    return res.status(401).json({
                        message: "not a valid zip code"
                    });
                }
            }else{
                return res.status(401).json({
                    message: "not a valid full name try not to include special characters like â or é"
                });
            } 
        }
    }


};

exports.updateShippingAdress = (req, res, next) => {
   
    let value1 = req.body.sameAsBilling;
    let value2 = req.body.idBillingAdress;
    let value3 = req.body.idUser;
    let value4 = req.body.note;
    let value5 = req.params.idShippingAdress
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(decoded.role == 'Customer' && decoded.idUser != req.body.idUser){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        if(typeof(value1) == "boolean"){
            if(typeof(value2) == "number"){
                if(typeof(value3) == "number"){
                    if(typeof(value4) == "undefined"){
                        value4 = "";
                    }
                    mysqlConnection.query({
                        sql: 'UPDATE shippingadress SET sameAsBilling = ? ,idBillingAdress = ? ,idUser = ? ,note = ? WHERE idShippingAdress = ?',
                        timeout: 10000, // 10s
                        values: [value1,value2,value3,value4,value5]
                    }, (err, rows, fields) => {
                        console.log(err)
                        if (!err) {
                            res.status(201).json(
                                {message : "Updated sucessfully"}
                            )
                        }else{
                            return res.status(401).json({
                                error: "something is wrong, please contact support",
                                info: err.sqlMessage
                            });
                        }
                    });
                }else{
                    return res.status(401).json({
                        error: "not a valid user ID"
                    });
                }
            }else{
                return res.status(401).json({
                    error: "not a valid billing address ID"
                });
            }
        }else{
            return res.status(401).json({
                error: "not a boolean value, please chose true or false"
            });
        }
    }
};

exports.getPersonalInfo = (req, res, next) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(false){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'SELECT * FROM personalinfo WHERE `idUser` = ? ',
            timeout: 10000, // 10s
            values: [req.params.idUser]
        }, (err, rows, fields) => {
            if (!err) {
                res.status(200).json(rows[0]);
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });


    }

};

exports.getUserAdress = (req, res, next) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(false){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'SELECT * FROM billingadress as b JOIN useradress as u ON u.idBillingAdress = b.idBillingAdress WHERE idUser = ?',
            timeout: 10000, // 10s
            values: [req.params.idUser]
        }, (err, rows, fields) => {
            if (!err) {
                res.status(200).json(rows);
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });


    }

};

exports.getShippingAdress = (req, res, next) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    if(false){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'SELECT * FROM shippingadress WHERE idUser = ?',
            timeout: 10000, // 10s
            values: [req.params.idUser]
        }, (err, rows, fields) => {
            if (!err) {
                res.status(200).json(rows);
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });
    }
};

exports.deleteAdress = (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);


    mysqlConnection.query({
        sql: 'Select * FROM billingadress as b JOIN useradress as u ON u.idBillingAdress = b.idBillingAdress WHERE b.idBillingAdress = ?',
        timeout: 10000, // 10s
        values: [req.params.idAdress]
    }, (err, rows, fields) => {
        if (!err) {
            console.log(rows)
            if(decoded.role == 'Customer' && decoded.idUser != rows[0].idUser){
                return res.status(401).json({
                    error: "you do not have the permission to execute this action, your information has been loged in our system"
                    //TODO: create a log
                });
            }else{
                mysqlConnection.query({
                    sql: 'DELETE FROM billingadress WHERE idBillingadress = ? ',
                    timeout: 10000, // 10s
                    values: [req.params.idAdress]
                }, (err, rows, fields) => {
                    if (!err) {
                        mysqlConnection.query({
                            sql: 'DELETE FROM useradress WHERE idBillingadress = ?',
                            timeout: 10000, // 10s
                            values: [req.params.idAdress]
                        }, (err, rows, fields) => {
                            if (!err) {
                                return res.status(201).json({
                                    message: "Deleted sucessfully"
                                });
                            } else {
                                return res.status(401).json({
                                    error: "somthing is wrong, pelase contact support",
                                    info : err.sqlMessage
                                });
                            }
                        });
                    } else {
                        return res.status(401).json({
                            error: "somthing is wrong, pelase contact support",
                            info : err.sqlMessage
                        });
                    }
                });

            }
        } else {
            return res.status(401).json({
                error: "somthing is wrong, pelase contact support",
                info : err.sqlMessage
            });
        }
    });





   
};

exports.deleteShippingAdress = (req, res, next) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);
    mysqlConnection.query({
        sql: 'Select * FROM shippingadress WHERE idShippingadress = ?',
        timeout: 10000, // 10s
        values: [req.params.idShippingAdress]
    }, (err, rows, fields) => {
        if (!err) {
            
            if(decoded.role == 'Customer' && decoded.idUser != rows[0].idUser){
                return res.status(401).json({
                    error: "you do not have the permission to execute this action, your information has been loged in our system"
                    //TODO: create a log
                });
            }else{
                mysqlConnection.query({
                    sql: 'DELETE FROM shippingAdress WHERE idShippingAdress = ?',
                    timeout: 10000, // 10s
                    values: [req.params.idShippingAdress]
                }, (err, rows, fields) => {
                    if (!err) {
                        return res.status(201).json({
                            message: "Deleted sucessfully"
                        });
                    } else {
                        return res.status(401).json({
                            error: "somthing is wrong, pelase contact support",
                            info : err.sqlMessage
                        });
                    }
                });
            }
        } else {
            return res.status(401).json({
                error: "somthing is wrong, pelase contact support",
                info : err.sqlMessage
            });
        }
    });

    
};

exports.deletePersonalInfo = (req, res, next) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);
    
    mysqlConnection.query({
        sql: 'Select * FROM personalinfo WHERE idPersonalInfo = ?',
        timeout: 10000, // 10s
        values: [req.params.idPersonalInfo]
    }, (err, rows, fields) => {
        if (!err) {
            
            if(decoded.role == 'Customer' && decoded.idUser != rows[0].idUser){
                return res.status(401).json({
                    error: "you do not have the permission to execute this action, your information has been loged in our system"
                    //TODO: create a log
                });
            }else{
                mysqlConnection.query({
                    sql: 'DELETE FROM personalinfo WHERE idPersonalInfo = ?',
                    timeout: 10000, // 10s
                    values: [req.params.idPersonalInfo]
                }, (err, rows, fields) => {
                    if (!err) {
                        return res.status(201).json({
                            message: "Deleted sucessfully"
                        });
                    } else {
                        return res.status(401).json({
                            error: "somthing is wrong, pelase contact support",
                            info : err.sqlMessage
                        });
                    }
                });
            }
        } else {
            return res.status(401).json({
                error: "somthing is wrong, pelase contact support",
                info : err.sqlMessage
            });
        }
    });

};








