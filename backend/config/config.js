const morgan = require("morgan");
const express = require('express');

module.exports = (app) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    // configuring to parse any incooming json requests
    app.use(express.json());

    // adding all the routes of the application
    require('../routes/index')(app);
}