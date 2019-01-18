'use strict';
const mysqlConnection = require('../database.js');

exports.getFirst = function (req, res) {
    mysqlConnection.query('SELECT * FROM employee WHERE id = 2', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
}