const morgan = require("morgan");
const express = require('express');
const cors = require('cors');

module.exports = (app) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    // configuring to parse any incooming json requests
    app.use(express.json());

    // configuring cors
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }));

    // adding all the routes of the application
    require('../routes/index')(app);
}