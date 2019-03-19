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

exports.addCategorie = (req, res) =>{
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let image = req.body.image
    let idChildCategorie = req.body.idChildCategorie

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'INSERT INTO categories VALUES (NULL, ?, ?, ?)',
            timeout: 10000, // 10s
            values: [name,image,idChildCategorie]
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

exports.updateCategorie = (req, res) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let name = req.body.name
    let image = req.body.image
    let idChildCategorie = req.body.idChildCategorie
    let idCategorie = req.params.idCategorie

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'UPDATE categories SET name = ? ,image = ? ,idChildCategorie = ? WHERE idCategorie = ?',
            timeout: 10000, // 10s
            values: [name,image,idChildCategorie,idCategorie]
        }, (err, rows, fields) => {
            if (!err) {
                return res.status(201).json({
                    message: "Updated suceefully"
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

exports.deleteCategorie = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idCategorie = req.params.idCategorie

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM categories WHERE idCategorie = ?',
            timeout: 10000, // 10s
            values: [idCategorie]
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

exports.getCategorie = (req, res) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idCategorie = req.params.idCategorie

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'SELECT * FROM categories WHERE idCategorie = ?',
            timeout: 10000, // 10s
            values: [idCategorie]
        }, (err, rows, fields) => {
            if (!err) {
                //res.send(rows)
                mysqlConnection.query({
                    sql: 'SELECT * FROM categories WHERE idChildCategorie = ?',
                    timeout: 10000, // 10s
                    values: [idCategorie]
                }, (err, rowss, fields) => {
                    if (!err) {
                        //res.send(rows)
                        let info = {
                            categorie : rows[0],
                            level1Childs : rowss
                        }
                        return res.status(200).json(info);
                    }else{
                        return res.status(401).json({
                            error: "something is wrong, pelase contact support",
                            info : err.sqlMessage
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

