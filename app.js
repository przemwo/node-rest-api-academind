const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS
app.use((req, res, next) => {
    // Specify who has access to your api
    res.header('Access-Control-Allow-Origin', '*');
    // Specify other allowed headers for incoming request
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // If this is an OPTIONS request...
    if(req.method === 'OPTIONS') {
        // ...specify allowed methods for incoming request...
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        // ...and send '200' response
        return res.status(200).json({});
    }
    // If this is not an OPTIONS request, don't return anything and go to the next middleware
    next();
});

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;