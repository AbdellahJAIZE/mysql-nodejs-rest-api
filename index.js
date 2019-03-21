const express           = require('express');
//const jwt               = require('jsonwebtoken');
const morgan            = require('morgan');
//const mongoose          = require('mongoose');
const cors              = require('./cors');
const PORT              = process.env.PORT || 5000; 
const app               = express();

process.env.JWT_KEY = 'secret_key';

app.use(cors);
app.use(express.json());
app.use(morgan('dev'));

//app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/brands', require('./routes/brands'));
app.use('/suppliers', require('./routes/suppliers'));
app.use('/categories', require('./routes/categories'));
app.use('/tags', require('./routes/tags'));
app.use('/orders', require('./routes/orders'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use((req, res, next) => {
    const error = new Error('Route not found!');
    error.status = 404;
    next(error);
});

app.use( (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));