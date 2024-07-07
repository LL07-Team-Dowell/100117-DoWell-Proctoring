const {
  generateDefaultResponseObject,
} = require("../utils/defaultResponseObject");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const path = require("path");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH = path.join(__dirname, "../config/token.json");

function authorize(credentials, callback, videoPath, videoDetails, res) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err)
      return getAccessToken(
        oAuth2Client,
        callback,
        videoPath,
        videoDetails,
        res
      );
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, videoPath, videoDetails, res);
  });
}

function getAccessToken(oAuth2Client, callback, videoPath, videoDetails, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client, videoPath, videoDetails, res);
    });
  });
}

function uploadVideo(auth, videoPath, videoDetails, res) {
  const youtube = google.youtube({ version: "v3", auth });
  youtube.videos.insert(
    {
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: videoDetails.title,
          description: videoDetails.description,
          tags: videoDetails.tags,
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    },
    (err, data) => {
      if (err) {
        res.status(500).json(
          generateDefaultResponseObject({
            success: true,
            message: "Error uploading video",
            data: null,
            error: null,
          })
        );
      } else {
        res.status(200).json(
          generateDefaultResponseObject({
            success: true,
            message: "Video uploaded successfully",
            data: data.data,
            error: null,
          })
        );
      }
      // Clean up the uploaded video file
      fs.unlink(videoPath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting video file:", unlinkErr);
      });
    }
  );
}

module.exports = {
  authorize,
  uploadVideo,
};
