const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const mysqlConnection = require('../database.js');

exports.withToken = (req, res, next) => {

    let token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded.role) // get role

    res.status(201).json(
        {message : "good"}
    )

};

exports.userSignup = (req, res) =>{
    bcrypt.hash(req.body.password, 16,(err, hash) => {
        let query = "INSERT INTO users VALUES (NULL,'"+req.body.email+"','"+hash+"','"+req.body.fullName+"')";
        mysqlConnection.query(query, (err, rows, fields) => {
            if (err) {
                res.status(201).json(
                    {message : "user created"}
                )
            } else {
                return res.status(401).json({
                    error: "Creation error"
                });
            }
        });
    })  
};

exports.userSignin = (req, res, next) =>{
    mysqlConnection.query("SELECT * FROM users WHERE email = '"+req.body.email+"'", (err, rows, fields) => {
        if (!err) {
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
                fullName: rows[0].fullName,
                role: rows[0].role,
                token: token,
                refreshToken: refreshToken
            }
            res.json(UserRes);

        } else {
            console.log(err);
        }
    });
};
