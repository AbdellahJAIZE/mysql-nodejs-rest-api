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
                error: "something is wrong, please contact support",
                info: err.sqlMessage 
            });
        }
    });


*/

exports.addOrder = (req, res) =>{
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idCustomer = req.body.idCustomer
    let idSeller = decoded.idUser 
    let idShippingAdress = req.body.idShippingAdress   

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'INSERT INTO orders VALUES (NULL, ?, ?, ?)',
            timeout: 10000, // 10s
            values: [idCustomer,idSeller,idShippingAdress]
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

exports.updateOrder = (req, res) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idCustomer = req.body.idCustomer
    let idSeller = req.body.idSeller
    let idShippingAdress = req.body.idShippingAdress
    let idOrder = req.params.idOrder
    
    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'UPDATE orders SET idCustomer = ?,idSeller = ?,idShippingAdress = ? WHERE idOrder = ?',
            timeout: 10000, // 10s
            values: [idCustomer,idSeller,idShippingAdress,idOrder]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Updated suceefully"
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

exports.deleteOrder = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idOrder = req.params.idOrder

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM orders WHERE idOrder = ?',
            timeout: 10000, // 10s
            values: [idOrder]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Deleted sucessfully"
                });
            } else {
                return res.status(401).json({
                    error: "something is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });
    }   
};

exports.getOrder = (req, res) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idOrder = req.params.idOrder

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'SELECT * FROM orders WHERE idOrder = ?',
            timeout: 10000, // 10s
            values: [idOrder]
        }, (err, rows, fields) => {
            if (!err) {
                mysqlConnection.query({
                    sql: 'SELECT * FROM orderproduct o, product p WHERE o.idOrder = ? AND o.idProduct = p.idProduct',
                    timeout: 10000, // 10s
                    values: [idOrder]
                }, (err, rowss, fields) => {
                    if (!err) {
                        let order = {
                            idOrder: rows[0].idOrder,
                            idCustomer: rows[0].idCustomer,
                            idSeller: rows[0].idSeller,
                            idShippingAdress: rows[0].idShippingAdress,
                            products: rowss
                        }
                        return res.status(200).json(order);
                    } else {
                        return res.status(401).json({
                            error: "something is wrong, please contact support",
                            info: err.sqlMessage 
                        });
                    }
                });
            }else{
                return res.status(401).json({
                    error: "something is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });   
    }
};

exports.addProductToOrder = (req, res) =>{
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idOrder = req.body.idOrder
    let idProduct = req.body.idProduct 
    let qte = req.body.qte   

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'INSERT INTO orderproduct VALUES (NULL, ?, ?, ?)',
            timeout: 10000, // 10s
            values: [idOrder,idProduct,qte]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Inserted suceefully"
                });
            } else {
                return res.status(401).json({
                    error: "something is wrong, please contact support",
                    info: err.sqlMessage 
                });
            }
        });
    }
};

exports.updateProductInOrder = (req, res) =>{
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idOrder = req.body.idOrder
    let idProduct = req.body.idProduct 
    let qte = req.body.qte   
    let idOrderProduct = req.params.idOrderProduct

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'UPDATE orderproduct SET idOrder = ?,idProduct = ?,qte = ? WHERE idOrderProduct = ?',
            timeout: 10000, // 10s
            values: [idOrder,idProduct,qte,idOrderProduct]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "UPDATED suceefully"
                });
            } else {
                return res.status(401).json({
                    error: "something is wrong, please contact support",
                    info: err.sqlMessage 
                });
            }
        });
    }
};
exports.deleteProductInOrder = (req, res) =>{
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idOrderProduct = req.params.idOrderProduct

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM orderproduct WHERE idOrderProduct = ?',
            timeout: 10000, // 10s
            values: [idOrderProduct]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Deleted sucessfully"
                });
            } else {
                return res.status(401).json({
                    error: "something is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });
    }   
};