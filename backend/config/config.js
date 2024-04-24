const morgan = require("morgan");
const express = require('express');
const cors = require('cors');

require('dotenv').config();

module.exports = (app, allowedOrigins=[]) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    // configuring to parse any incoming json requests
    app.use(express.json());

    // configuring cors
    app.use(cors({
        origin: Array.isArray(allowedOrigins) ? allowedOrigins : [],
        credentials: true,
    }));

    // adding all the routes of the application
    require('../routes/index')(app);
};

const config = {
    PORT: process.env.PORT || 9000,
    IP: process.env.IP,
    MONGO_DB_URI: process.env.MONGO_DB_URI
};
console.log(config.PORT);

module.exports = config;
