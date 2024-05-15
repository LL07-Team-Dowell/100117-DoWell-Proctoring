const express = require("express");
const { createServer } = require("http");
const PORT = process.env.PORT || 9000;

require("dotenv").config();

// loading and parsing all the permitted frontend urls for cors
let allowedOrigins = [];
try {
    allowedOrigins = JSON.parse(process.env.FRONTEND_URLS);
} catch (error) {
    console.log("Error parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: ", '["valid_url_1", "valid_url_2"]');
}

// creating a new express application
const app = express();

const httpServer = createServer(app);

// adding peer server
require('./config')(app, httpServer, allowedOrigins);

httpServer.listen(PORT, async () => {
    console.log(`Peer server running on port ${PORT}`);
})