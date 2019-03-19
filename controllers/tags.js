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

exports.addTag = (req, res) =>{
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let title = req.body.title

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'INSERT INTO tags VALUES (NULL, ?)',
            timeout: 10000, // 10s
            values: [title]
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

exports.updateTag = (req, res) => {
    
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let title = req.body.title
    let idTag = req.params.idTag
    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{

        mysqlConnection.query({
            sql: 'UPDATE tags SET title = ? WHERE idTag = ?',
            timeout: 10000, // 10s
            values: [title,idTag]
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

exports.deleteTag = (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idTag = req.params.idTag

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'DELETE FROM tags WHERE idTag = ?',
            timeout: 10000, // 10s
            values: [idTag]
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

exports.getTag = (req, res) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);

    let idTag = req.params.idTag

    if(decoded.role == 'Customer'){
        return res.status(401).json({
            error: "you do not have the permission to execute this action, your information has been loged in our system"
            //TODO: create a log
        });
    }else{
        mysqlConnection.query({
            sql: 'SELECT * FROM tags WHERE idTag = ?',
            timeout: 10000, // 10s
            values: [idTag]
        }, (err, rows, fields) => {
            if (!err) {
                //res.send(rows)
                return res.status(200).json(rows[0]);
            }else{
                return res.status(401).json({
                    error: "something is wrong, pelase contact support",
                    info : err.sqlMessage
                });
            }
        });   
    }
};

