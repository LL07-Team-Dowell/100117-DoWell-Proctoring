const fs = require("fs");
const express = require("express");
const multer = require("multer");

const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const uploadVideoController = require("../controller/uploadController");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.get("", (req, res) => {
  res.status(404).json(
    generateDefaultResponseObject({
      success: false,
      message: "No GET request allowed",
      data: null,
      error: null,
    })
  );
});
router.post("", upload.single("video"), uploadVideoController);

module.exports = router;
