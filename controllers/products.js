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

exports.addProduct = (req, res) =>{
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let price = req.body.price
    let stock = req.body.Stock
    let title = req.body.title
	let fullTitle = req.body.fullTitle	
	let idBrand = req.body.idBrand
	let idSupplier = req.body.idSupplier
	let description = req.body.description
	let idCategorie = req.body.idCategorie

    if(typeof(price) == 'number'){
        if(typeof(stock) == 'number'){
            if(decoded.role == 'Customer'){
                return res.status(401).json({
                    error: "you do not have the permission to execute this action, your information has been loged in our system"
                    //TODO: create a log
                });
            }else{

                mysqlConnection.query({
                    sql: 'INSERT INTO product VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
                    timeout: 10000, // 10s
                    values: [title,fullTitle,idBrand,idSupplier,description,price,stock,idCategorie]
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

        }else{
            return res.status(401).json({
                error: "not a valid stock number"
            });
        }
    }else{
        return res.status(401).json({
            error: "not a valid price"
        });
    }


    
};

exports.updateProduct = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let price = req.body.price
    let stock = req.body.Stock
    let title = req.body.title
	let fullTitle = req.body.fullTitle	
	let idBrand = req.body.idBrand
	let idSupplier = req.body.idSupplier
	let description = req.body.description
    let idCategorie = req.body.idCategorie
    
    let idProduct = req.params.idProduct

    if(typeof(price) == 'number'){
        if(typeof(stock) == 'number'){
            if(decoded.role == 'Customer'){
                return res.status(401).json({
                    error: "you do not have the permission to execute this action, your information has been loged in our system"
                    //TODO: create a log
                });
            }else{

                mysqlConnection.query({
                    sql: 'UPDATE product SET title = ? ,fullTitle = ? ,idBrand = ? ,idSupplier = ? ,description = ? ,price = ? ,Stock = ? ,idCategorie = ? WHERE idProduct = ? ',
                    timeout: 10000, // 10s
                    values: [title,fullTitle,idBrand,idSupplier,description,price,stock,idCategorie,idProduct]
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

        }else{
            return res.status(401).json({
                error: "not a valid stock number"
            });
        }
    }else{
        return res.status(401).json({
            error: "not a valid price"
        });
    }

};

exports.deleteProduct = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idProduct = req.params.idProduct

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM product WHERE idProduct = ?',
            timeout: 10000, // 10s
            values: [idProduct]
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

exports.getProduct = (req, res) => {
    //TODO: with all others
};