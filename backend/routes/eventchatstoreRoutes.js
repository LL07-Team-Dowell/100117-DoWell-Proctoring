const express = require("express");
const app = express();
const eventschatstoreController = require("../controller/eventchatstoreController");

// Route to create a new event chat store entry
router.post("/eventschatstore", eventschatstoreController.createEventChat);


module.exports = router;
