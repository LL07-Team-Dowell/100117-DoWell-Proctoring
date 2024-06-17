const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
const PORT = 3000;

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `http://localhost:${PORT}/oauth2callback`
);

const SCOPES = ["https://www.googleapis.com/auth/youtube"];

app.get("/auth", async (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  // Dynamically import the open module
  const { default: open } = await import("open");
  await open(authUrl);
  res.send("Authentication in progress...");
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);

  console.log("Token Response:", tokens);

  oAuth2Client.setCredentials(tokens);
  console.log("Access Token:", tokens.access_token);
  console.log("Refresh Token:", tokens.refresh_token);
  res.send("Authentication successful! You can close this window.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/auth to start the OAuth flow`);
});
