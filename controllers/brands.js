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

exports.addBrand = (req, res) =>{
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let description	 = req.body.description
    let image = req.body.image
    
    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'INSERT INTO brand VALUES (NULL, ?, ?, ?)',
            timeout: 10000, // 10s
            values: [name,description,image]
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

exports.updateBrand = (req, res) => {
   
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let description	 = req.body.description
    let image = req.body.image
    
    let idBrand = req.params.idBrand

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'UPDATE brand SET name = ? ,description = ? ,image = ? WHERE idBrand = ?',
            timeout: 10000, // 10s
            values: [name,description,image,idBrand]
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

exports.deleteBrand = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idBrand = req.params.idBrand

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM brand WHERE idBrand = ?',
            timeout: 10000, // 10s
            values: [idBrand]
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

exports.getBrand = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    
    let idBrand = req.params.idBrand
    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'SELECT * FROM brand WHERE idBrand = ?',
            timeout: 10000, // 10s
            values: [idBrand]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json(rows[0]);
            } else {
                return res.status(401).json({
                    error: "somthing is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });
    }

};