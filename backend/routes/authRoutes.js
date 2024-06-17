const express = require("express");
const AuthController = require("../controller/authController");

const router = express.Router();

router.get("/auth", AuthController.getAuthUrl);
router.get("/oauth2callback", AuthController.oauth2Callback);

module.exports = router;
