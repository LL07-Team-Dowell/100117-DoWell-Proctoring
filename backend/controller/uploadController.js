const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const { authorize, uploadVideo } = require("../config/ytConfig");
const fs = require("fs");
const path = require("path");

const CREDENTIAL_PATH = path.join(__dirname, "../config/credentials.json");

let credentials;

// Load client secrets from a local file.
fs.readFile(CREDENTIAL_PATH, (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  credentials = JSON.parse(content);
});

const uploadVideoController = (req, res) => {
  if (!req.file) {
    return res.status(400).json(
      generateDefaultResponseObject({
        success: false,
        message: "No video file found",
        data: null,
        error: null,
      })
    );
  }
  let { title, description, tags } = req.body;
  if (!title || !description) {
    return res.status(401).json(
      generateDefaultResponseObject({
        success: false,
        message: "Title and Description fields are required.",
        data: null,
        error: null,
      })
    );
  }
  if (!tags) {
    tags = "dowell, dowellProcoring";
  }
  const videoDetails = { title, description, tags: tags.split(",") };
  const videoPath = req.file.path;
  authorize(credentials, uploadVideo, videoPath, videoDetails, res);
};

module.exports = uploadVideoController;
