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

exports.addSupplier = (req, res) =>{
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let idUser = req.body.idUser

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'INSERT INTO suppliers VALUES (NULL, ?, ?)',
            timeout: 10000, // 10s
            values: [name,idUser]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Inserted suceefully"
                });
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, please contact support",
                    info: err.sqlMessage 
                });
            }
        });

    }

};

exports.updateSupplier = (req, res) => {
   
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let idUser = req.body.idUser
    let idSupplier = req.params.idSupplier

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'UPDATE suppliers SET name = ?,idUser = ? WHERE idSupplier = ?',
            timeout: 10000, // 10s
            values: [name,idUser,idSupplier]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Updates suceefully"
                });
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, please contact support",
                    info: err.sqlMessage 
                });
            }
        });

    }

};

exports.deleteSupplier = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idSupplier = req.params.idSupplier

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM suppliers WHERE idSupplier = ?',
            timeout: 10000, // 10s
            values: [idSupplier]
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
        
    
};

exports.getSupplier = (req, res) => {


    //need to get the adress too

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    
    let idSupplier = req.params.idSupplier


    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'SELECT * FROM suppliers WHERE idSupplier = ?',
            timeout: 10000, // 10s
            values: [idSupplier]
        }, (err, rows, fields) => {
            if (!err) {

                mysqlConnection.query({
                    sql: 'SELECT b.idBillingAdress, b.fullName ,b.address1 ,b.address2 ,b.zipCode ,b.city ,b.region ,b.country FROM suppliers s, useradress as u , billingadress as b WHERE u.idUser = s.idUser AND b.idBillingadress = u.idBillingadress AND s.idSupplier = ?',
                    timeout: 10000, // 10s
                    values: [idSupplier]
                }, (err, rows, fields) => {
                    if (!err) {
                        let address = rows
                        mysqlConnection.query({
                            sql: 'SELECT * FROM suppliers WHERE idSupplier = ?',
                            timeout: 10000, // 10s
                            values: [idSupplier]
                        }, (err, rowss, fields) => {
                            if (!err) {
                                    /*
                                    let supplier = {
                                        //idSupplier = rowss[0].idSupplier,
                                        addresses = address
                                    }
*/
                                    res.send(rowss)
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




                /*let supplier = {
                    name : rows[0].name,
                    adresses: 
                }*/
               // return res.status(201).json(rows[0]);
            
        
    }

};