const express = require("express");
const router = express.Router();
const uploadController = require("../controller/youtubeUploadController");
const multer = require("multer");

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("", upload.single("video"), uploadController.uploadVideo);

module.exports = router;
