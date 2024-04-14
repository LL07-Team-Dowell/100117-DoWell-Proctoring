const { Router } = require("express");
const messageController = require("../controller/messageController");

const router = Router();

// Route to create a new event chat store entry
//router.post("/create", messageController.addmessage);
router.patch("/update", messageController.updatemessage);


module.exports = router;
