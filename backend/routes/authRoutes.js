const express = require("express");
const AuthController = require("../controller/authController");

const router = express.Router();

router.get("", AuthController.getAuthUrl);
router.get("/google-callback", AuthController.oauth2Callback);

module.exports = router;
