const express = require("express");
const { createServer } = require("http");
const PORT = process.env.PORT || 9000;

require("dotenv").config();

// loading and parsing all the permitted frontend urls for cors
let allowedOrigins = [];

try {
    allowedOrigins = JSON.parse(process.env.FRONTEND_URLS);
} catch (error) {
    
    if (typeof window === 'undefined') {
        // Node.js environment
        console.log("\x1b[31m%s\x1b[0m",error)
        console.log(
            "\x1b[31m%s\x1b[0m", 
            "Error parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: ", '["valid_url_1", "valid_url_2"]'
        );
    } else {
        // Browser environment
        console.log(`%c${error}`,
                    "color: red;",
                    "color: black;")
        console.log(
            "%cError parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: %c['valid_url_1', 'valid_url_2']",
            "color: red;",
            "color: black;"
        );
    }
    
}

// creating a new express application
const app = express();

const httpServer = createServer(app);

// adding peer server
require('./config')(app, httpServer, allowedOrigins);

httpServer.listen(PORT, async () => {
    console.log(`Peer server running on port ${PORT}`);
})